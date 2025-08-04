import * as admin from "firebase-admin";

export interface SupplierProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  images: string[];
  stock: number;
  active: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  ean?: string;
  sku?: string;
  supplier: string;
  supplierProductId: string;
}

export interface SupplierInterface {
  name: string;
  searchProducts(
    query: string,
    category?: string,
    limit?: number
  ): Promise<SupplierProduct[]>;
  getProductDetails(productId: string): Promise<SupplierProduct>;
  checkStock(productId: string): Promise<number>;
  syncStock(
    productIds: string[]
  ): Promise<{ productId: string; stock: number; success: boolean }[]>;
  getCategories(): Promise<{ id: string; name: string; parentId?: string }[]>;
}

export class SupplierRegistry {
  private static suppliers: Map<string, SupplierInterface> = new Map();

  static register(name: string, supplier: SupplierInterface): void {
    this.suppliers.set(name, supplier);
  }

  static get(name: string): SupplierInterface | undefined {
    return this.suppliers.get(name);
  }

  static getAll(): string[] {
    return Array.from(this.suppliers.keys());
  }
}

/**
 * Generic product import function that works with any registered supplier
 * @param supplierName - Name of the supplier (e.g., 'bigbuy')
 * @param products - Array of products to import
 * @param adminUid - Admin user ID for audit logging
 */
export async function importProductsFromSupplier(
  supplierName: string,
  products: SupplierProduct[],
  adminUid: string
): Promise<{
  success: boolean;
  imported: number;
  updated: number;
  errors: string[];
}> {
  const db = admin.firestore();
  const batch = db.batch();
  const errors: string[] = [];
  let imported = 0;
  let updated = 0;

  try {
    for (const product of products) {
      try {
        const productId = `${supplierName}-${product.supplierProductId}`;
        const productRef = db.collection("products").doc(productId);
        const existingProduct = await productRef.get();

        const productData = {
          ...product,
          id: productId,
          origin: supplierName,
          lastSyncDate: admin.firestore.FieldValue.serverTimestamp(),
          importedBy: adminUid,
        };

        if (existingProduct.exists) {
          batch.update(productRef, productData);
          updated++;
        } else {
          batch.set(productRef, productData);
          imported++;
        }

        // Create/update inventory record
        const inventoryRef = db.collection("inventory").doc(productId);
        batch.set(
          inventoryRef,
          {
            productId,
            quantity: product.stock,
            supplier: supplierName,
            reorderPoint: 10, // Default reorder point
            cost: product.originalPrice || product.price * 0.7, // Estimate cost
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      } catch (productError) {
        console.error(`Error processing product ${product.id}:`, productError);
        errors.push(
          `Failed to process product ${product.name}: ${productError}`
        );
      }
    }

    await batch.commit();

    // Log the import activity
    await db.collection("import_logs").add({
      supplier: supplierName,
      imported,
      updated,
      totalProcessed: products.length,
      errors: errors.length,
      performedBy: adminUid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      imported,
      updated,
      errors,
    };
  } catch (error) {
    console.error("Batch import failed:", error);
    return {
      success: false,
      imported: 0,
      updated: 0,
      errors: [`Batch import failed: ${error}`],
    };
  }
}

/**
 * Generic stock sync function for any supplier
 * @param supplierName - Name of the supplier
 * @param productIds - Array of product IDs to sync
 */
export async function syncStockFromSupplier(
  supplierName: string,
  productIds: string[]
): Promise<{
  success: boolean;
  results: { productId: string; stock: number; success: boolean }[];
}> {
  const supplier = SupplierRegistry.get(supplierName);
  if (!supplier) {
    throw new Error(`Supplier ${supplierName} not found`);
  }

  const results = await supplier.syncStock(productIds);
  const db = admin.firestore();
  const batch = db.batch();

  for (const result of results) {
    if (result.success) {
      // Update product stock
      const productRef = db.collection("products").doc(result.productId);
      batch.update(productRef, {
        stock: result.stock,
        lastStockUpdate: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update inventory
      const inventoryRef = db.collection("inventory").doc(result.productId);
      batch.update(inventoryRef, {
        quantity: result.stock,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }

  await batch.commit();

  return {
    success: true,
    results,
  };
}
