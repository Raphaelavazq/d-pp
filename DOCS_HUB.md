# 🏗️ düpp Developer Documentation Hub

<div align="center">

![düpp Logo](./src/assets/logo.svg)

**Complete Technical Documentation Portal**  
_Enterprise-grade React + Firebase e-commerce platform_

![Platform](https://img.shields.io/badge/Platform-React%2018%20%2B%20Firebase-blue)
![Security](https://img.shields.io/badge/Security-GDPR%20Compliant-green)
![Score](https://img.shields.io/badge/Security%20Score-96%2F100-brightgreen)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

---

**🚀 Quick Navigation**  
[🔐 Security](#-security--compliance) • [⚙️ Backend](#-backend--api) • [🎨 Frontend](#-frontend--ui) • [📊 Data](#-data--integrations) • [🚀 Deploy](#-deployment--operations) • [🧪 Testing](#-testing--quality)

</div>

---

## 🎯 Welcome to düpp DevHub

### **What is düpp?**

Premium e-commerce platform built for the European market with enterprise-grade security, GDPR compliance, and BigBuy dropshipping integration. Designed for scalability, performance, and developer experience.

### **Who is this for?**

- 👨‍💻 **Internal Developers** - Full-stack engineers and specialists
- 🆕 **New Contributors** - Onboarding developers and contractors
- 🛡️ **Security Team** - Security specialists and compliance officers
- 🚀 **DevOps Engineers** - Infrastructure and deployment specialists
- 📋 **Product Teams** - Technical requirements and feature planning

### **Tech Stack Overview**

```
Frontend: React 18 + Vite + Tailwind CSS + GSAP
Backend:  Firebase (Auth, Firestore, Functions)
APIs:     BigBuy + Stripe + Analytics
Security: GDPR/DSGVO + PCI-DSS + Enterprise-grade
Deploy:   Firebase Hosting + EU region processing
```

---

## 🚦 Getting Started

<table>
<tr>
<td width="33%">

### 👥 **New Developers**

```bash
1. Read Security Guidelines
2. Setup Development Environment
3. Explore Data Models
4. Review Code Standards
```

**Start Here:** [🔐 Security Guidelines](#-security--compliance)

</td>
<td width="33%">

### 🔧 **Contributors**

```bash
1. Check Feature Checklist
2. Follow API Reference
3. Run Testing Suite
4. Submit Pull Request
```

**Start Here:** [🛠️ Development Workflow](#-development--features)

</td>
<td width="33%">

### 🛡️ **Security Team**

```bash
1. Review Security Overview
2. Run Security Audit
3. Monitor Compliance
4. Update Procedures
```

**Start Here:** [🛡️ Security Overview](#-security--compliance)

</td>
</tr>
</table>

---

## 📖 Documentation Sections

### 🔐 Security & Compliance

_🚨 MANDATORY - Read before any development work_

<div style="border-left: 4px solid #ef4444; padding-left: 16px; margin: 16px 0;">

**⚠️ CRITICAL:** All developers must read security guidelines before contributing code

</div>

| Document                                                  | Description                                                       | Priority     | Audience       |
| --------------------------------------------------------- | ----------------------------------------------------------------- | ------------ | -------------- |
| **[🛡️ SECURITY_GUIDELINES.md](./SECURITY_GUIDELINES.md)** | Mandatory security practices, GDPR checklist, secure coding       | 🔴 Critical  | All Developers |
| **[🏗️ SECURITY_OVERVIEW.md](./SECURITY_OVERVIEW.md)**     | Enterprise security architecture, threat model, incident response | 🔴 Critical  | Security Team  |
| **[📋 GDPR_COMPLIANCE.md](./GDPR_COMPLIANCE.md)**         | European data protection, user rights implementation              | 🟡 Important | Backend Devs   |

<details>
<summary>🔍 <strong>Security Quick Access</strong></summary>

**🚨 Emergency Contacts**

- Security incidents: `security@dupp.com`
- Emergency hotline: `+49-XXX-XXX-XXXX` (24/7)
- GDPR compliance: `privacy@dupp.com`

**✅ Security Checklist**

- [ ] API keys server-side only
- [ ] Input validation & sanitization
- [ ] GDPR consent management
- [ ] Multi-layer authentication
- [ ] Audit logging enabled

</details>

---

### ⚙️ Backend & API

_Server-side architecture, Firebase Functions, and integrations_

| Document                                                      | Description                                       | Priority     | Audience         |
| ------------------------------------------------------------- | ------------------------------------------------- | ------------ | ---------------- |
| **[📡 API_REFERENCE.md](./API_REFERENCE.md)**                 | Complete API docs, endpoints, authentication      | 🟡 Important | All Developers   |
| **[🔥 FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md)** | Cloud Functions, Firestore rules, configuration   | 🟡 Important | Backend Devs     |
| **[📦 BIGBUY_INTEGRATION.md](./BIGBUY_INTEGRATION.md)**       | Dropshipping API, product import, stock sync      | 🟢 Standard  | Backend Devs     |
| **[💳 STRIPE_INTEGRATION.md](./STRIPE_INTEGRATION.md)**       | Payment processing, webhooks, PCI compliance      | 🟡 Important | Backend Devs     |
| **[☁️ CLOUD_FUNCTIONS_GUIDE.md](./CLOUD_FUNCTIONS_GUIDE.md)** | Function deployment, environment setup, debugging | 🟢 Standard  | DevOps + Backend |

<details>
<summary>⚡ <strong>Backend Quick Commands</strong></summary>

```bash
# Development Setup
firebase emulators:start          # Start local emulators
npm run dev                       # Start frontend dev server

# Function Deployment
cd functions && npm run build     # Compile TypeScript
firebase deploy --only functions # Deploy to production

# Environment Management
firebase functions:config:set bigbuy.api_key="key"
firebase functions:config:get    # View current config

# Database Operations
firebase firestore:delete --recursive /path
firebase firestore:indexes       # Manage indexes
```

</details>

---

### 🎨 Frontend & UI

_React components, state management, animations, and user experience_

| Document                                                  | Description                                       | Priority     | Audience       |
| --------------------------------------------------------- | ------------------------------------------------- | ------------ | -------------- |
| **[🧩 COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md)**     | Reusable UI components, props, styling guidelines | 🟡 Important | Frontend Devs  |
| **[🔄 STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)**       | Context API, hooks, data flow patterns            | 🟡 Important | Frontend Devs  |
| **[✨ ANIMATION_GUIDE.md](./ANIMATION_GUIDE.md)**         | GSAP implementation, ScrollTrigger, performance   | 🟢 Standard  | Frontend Devs  |
| **[♿ ACCESSIBILITY_GUIDE.md](./ACCESSIBILITY_GUIDE.md)** | ARIA attributes, keyboard nav, screen readers     | 🔴 Critical  | All Developers |
| **[📱 RESPONSIVE_DESIGN.md](./RESPONSIVE_DESIGN.md)**     | Breakpoints, mobile-first, touch interfaces       | 🟡 Important | Frontend Devs  |

<details>
<summary>🎨 <strong>Frontend Quick Patterns</strong></summary>

```jsx
// Essential Hook Pattern
import { useAuth, useCart, useFirestore } from "../hooks";

const MyComponent = ({ product, ...props }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart, cartItems } = useCart();
  const { data, loading, error } = useFirestore("products");

  return (
    <article
      className="component-base"
      aria-label={`Product: ${product.title}`}
    >
      {/* Accessible JSX content */}
    </article>
  );
};

// GSAP Animation Pattern
useEffect(() => {
  const tl = gsap.timeline();
  tl.from(".animate-in", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
  });

  ScrollTrigger.create({
    trigger: ".scroll-trigger",
    start: "top 80%",
    animation: tl,
  });
}, []);
```

</details>

---

### 📊 Data & Integrations

_Database structure, third-party services, and data flow_

| Document                                          | Description                                              | Priority     | Audience       |
| ------------------------------------------------- | -------------------------------------------------------- | ------------ | -------------- |
| **[📋 DATA_MODELS.md](./DATA_MODELS.md)**         | Firestore collections, document structure, relationships | 🔴 Critical  | All Developers |
| **[🔗 INTEGRATIONS.md](./INTEGRATIONS.md)**       | Third-party services overview, setup instructions        | 🟡 Important | Backend Devs   |
| **[🗄️ DATABASE_DESIGN.md](./DATABASE_DESIGN.md)** | NoSQL patterns, indexing, performance optimization       | 🟢 Standard  | Backend Devs   |
| **[📈 ANALYTICS_SETUP.md](./ANALYTICS_SETUP.md)** | User tracking, performance monitoring, privacy           | 🟢 Standard  | Full Stack     |
| **[💾 BACKUP_RECOVERY.md](./BACKUP_RECOVERY.md)** | Data backup strategy, disaster recovery procedures       | 🟡 Important | DevOps         |

<details>
<summary>📊 <strong>Data Architecture Overview</strong></summary>

```javascript
// Core Firestore Collections
/users/{userId}              // User profiles & preferences
  ├── /orders                // User's order history (subcollection)
  └── /preferences           // User settings (subcollection)

/products/{productId}        // Product catalog
  ├── variants              // Product variations
  ├── pricing              // Price history
  └── inventory            // Stock levels

/orders/{orderId}           // Global order management
  ├── items                // Order line items
  ├── payments             // Payment tracking
  └── fulfillment          // Shipping status

/admin/{document}           // Admin-only collections
  ├── analytics            // Business metrics
  ├── imports              // BigBuy import logs
  └── system              // System configuration

// Security Rules Pattern
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for active products
    match /products/{productId} {
      allow read: if resource.data.status == 'active';
      allow write: if isAdmin();
    }

    // User owns their data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Admin-only access
    match /admin/{document=**} {
      allow read, write: if isAdmin();
    }
  }
}
```

</details>

---

### 🚀 Deployment & Operations

_Infrastructure, CI/CD, monitoring, and production management_

| Document                                              | Description                                          | Priority     | Audience         |
| ----------------------------------------------------- | ---------------------------------------------------- | ------------ | ---------------- |
| **[🚀 DEPLOYMENT.md](./DEPLOYMENT.md)**               | Production deployment, environment variables, CI/CD  | 🔴 Critical  | DevOps + Backend |
| **[⚙️ ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)** | Local development setup, dependencies, configuration | 🔴 Critical  | All Developers   |
| **[📊 MONITORING_GUIDE.md](./MONITORING_GUIDE.md)**   | Application monitoring, alerts, performance tracking | 🟡 Important | DevOps           |
| **[🔧 MAINTENANCE.md](./MAINTENANCE.md)**             | Regular maintenance tasks, updates, backups          | 🟢 Standard  | DevOps           |
| **[🐛 TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**     | Common issues, debugging steps, error resolution     | 🟡 Important | All Developers   |

<details>
<summary>🚀 <strong>Deployment Quick Guide</strong></summary>

```bash
# Environment Setup
git clone https://github.com/dupp/e-commerce.git
cd e-commerce
npm install && cd functions && npm install

# Local Development
firebase login                    # Authenticate with Firebase
firebase use --add               # Add project alias
cp .env.example .env             # Configure environment
firebase emulators:start        # Start local services

# Production Deployment
npm run build                    # Build for production
npm run test                     # Run test suite
firebase deploy                 # Full deployment

# Function-only Deployment
cd functions
npm run build                    # Compile TypeScript
cd .. && firebase deploy --only functions

# Monitoring & Logs
firebase functions:log           # View function logs
firebase hosting:sites:list     # Check hosting status
```

**🌍 Deployment Regions**

- **Production**: `europe-west1` (Belgium) - GDPR compliant
- **Staging**: `europe-west1` (Belgium) - Mirror production
- **Development**: Local emulators + `europe-west1`

</details>

---

### 🧪 Testing & Quality

_Testing strategies, quality assurance, and code standards_

| Document                                                  | Description                                         | Priority     | Audience          |
| --------------------------------------------------------- | --------------------------------------------------- | ------------ | ----------------- |
| **[🧪 TESTING.md](./TESTING.md)**                         | Unit tests, integration tests, end-to-end testing   | 🔴 Critical  | All Developers    |
| **[📏 CODE_STANDARDS.md](./CODE_STANDARDS.md)**           | Coding conventions, linting rules, formatting       | 🔴 Critical  | All Developers    |
| **[✅ QUALITY_ASSURANCE.md](./QUALITY_ASSURANCE.md)**     | QA processes, testing checklists, bug reporting     | 🟡 Important | QA + Developers   |
| **[⚡ PERFORMANCE_TESTING.md](./PERFORMANCE_TESTING.md)** | Load testing, optimization, monitoring              | 🟢 Standard  | Full Stack        |
| **[🔒 SECURITY_TESTING.md](./SECURITY_TESTING.md)**       | Security testing procedures, vulnerability scanning | 🔴 Critical  | Security + DevOps |

<details>
<summary>🧪 <strong>Testing Commands & Standards</strong></summary>

```bash
# Testing Commands
npm test                         # Run all tests
npm run test:watch              # Run tests in watch mode
npm run test:coverage           # Generate coverage report
npm run test:e2e                # Run end-to-end tests

# Code Quality
npm run lint                    # ESLint check
npm run lint:fix               # Auto-fix linting issues
npm run format                 # Prettier formatting
npm run type-check             # TypeScript validation

# Performance Testing
npm run build:analyze          # Bundle analysis
npm run lighthouse             # Performance audit
npm run test:load              # Load testing

# Security Testing
npm audit                      # Dependency vulnerabilities
npm run security:scan          # Security vulnerability scan
./security-check.sh           # Custom security checks
```

**📊 Quality Gates**

- ✅ Test coverage: >80% (critical paths), >60% (overall)
- ✅ Performance: Lighthouse score >90
- ✅ Security: No high/critical vulnerabilities
- ✅ Accessibility: WCAG 2.1 AA compliance
- ✅ Code quality: ESLint + Prettier enforced

</details>

---

### 🛠️ Development & Features

_Feature development, version control, and project management_

| Document                                                    | Description                                          | Priority     | Audience         |
| ----------------------------------------------------------- | ---------------------------------------------------- | ------------ | ---------------- |
| **[📋 FEATURE_CHECKLIST.md](./FEATURE_CHECKLIST.md)**       | Development workflow, feature flags, release process | 🟡 Important | All Developers   |
| **[🌿 VERSION_CONTROL.md](./VERSION_CONTROL.md)**           | Git workflows, branching strategy, code review       | 🔴 Critical  | All Developers   |
| **[🏗️ PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**       | Codebase organization, file naming, architecture     | 🟡 Important | All Developers   |
| **[🔄 DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md)** | Day-to-day development process, tools, practices     | 🟡 Important | All Developers   |
| **[📖 RELEASE_NOTES.md](./RELEASE_NOTES.md)**               | Version history, changelog, breaking changes         | 🟢 Standard  | All Stakeholders |

<details>
<summary>🛠️ <strong>Development Workflow</strong></summary>

```bash
# Feature Development Workflow
git checkout main
git pull origin main
git checkout -b feature/amazing-new-feature

# Development Cycle
npm run dev                     # Start development server
# ... make changes ...
npm run lint && npm test       # Quality checks
git add . && git commit -m "feat: add amazing feature"

# Code Review Process
git push origin feature/amazing-new-feature
# Create pull request on GitHub
# Wait for code review and approval
# Merge to main after CI passes

# Release Process
git checkout main && git pull
npm run build && npm test      # Final checks
firebase deploy               # Deploy to production
git tag v1.2.3               # Tag release
```

**🔀 Git Workflow**

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature development branches
- `hotfix/*` - Emergency production fixes
- `release/*` - Release preparation branches

**📦 Release Strategy**

- Semantic versioning (MAJOR.MINOR.PATCH)
- Feature flags for gradual rollouts
- A/B testing for UX experiments
- Automated deployment via GitHub Actions

</details>

---

### 🎯 Admin & Management

_Admin dashboard, content management, and business operations_

| Document                                                      | Description                                     | Priority     | Audience    |
| ------------------------------------------------------------- | ----------------------------------------------- | ------------ | ----------- |
| **[👨‍💼 ADMIN_PANEL_GUIDE.md](./ADMIN_PANEL_GUIDE.md)**         | Complete admin dashboard usage and features     | 🟡 Important | Admin Users |
| **[📦 PRODUCT_MANAGEMENT.md](./PRODUCT_MANAGEMENT.md)**       | Product catalog management, inventory, pricing  | 🟡 Important | Admin Users |
| **[📋 ORDER_MANAGEMENT.md](./ORDER_MANAGEMENT.md)**           | Order processing, fulfillment, customer service | 🟡 Important | Admin Users |
| **[👥 USER_MANAGEMENT.md](./USER_MANAGEMENT.md)**             | Customer accounts, roles, permissions, support  | 🟡 Important | Admin Users |
| **[🔄 BIGBUY_IMPORTER_GUIDE.md](./BIGBUY_IMPORTER_GUIDE.md)** | Product import, stock sync, supplier management | 🟢 Standard  | Admin Users |

<details>
<summary>🎯 <strong>Admin Quick Access</strong></summary>

**🔐 Admin Access**

- URL: `https://dupp-store.web.app/admin`
- Authentication: Custom Firebase admin claims
- MFA: Recommended for admin accounts
- Session: 8-hour timeout with activity extension

**⚡ Key Admin Functions**

- **Product Management**: CRUD operations, bulk import, pricing
- **Order Processing**: Order fulfillment, tracking, refunds
- **User Management**: Account operations, role assignment, support
- **Analytics Dashboard**: Sales metrics, user behavior, performance
- **System Configuration**: App settings, feature flags, maintenance

**📊 Admin Dashboard Sections**

```
/admin/dashboard          # Overview & analytics
/admin/products          # Product catalog management
/admin/orders            # Order processing & fulfillment
/admin/users             # Customer account management
/admin/imports           # BigBuy product import
/admin/analytics         # Business intelligence
/admin/settings          # System configuration
```

</details>

---

## 🔗 External Resources & Tools

### **🏢 Official Documentation**

- [Firebase Documentation](https://firebase.google.com/docs) - Backend infrastructure
- [React Documentation](https://react.dev) - Frontend framework
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Styling framework
- [GSAP Documentation](https://greensock.com/docs/) - Animation library

### **🔌 API References**

- [BigBuy API Documentation](https://api.bigbuy.eu/docs) - Dropshipping integration
- [Stripe API Reference](https://stripe.com/docs/api) - Payment processing
- [Lucide Icons](https://lucide.dev/) - Icon library

### **🛡️ Compliance & Security**

- [GDPR Official Text](https://gdpr.eu/) - European data protection
- [Firebase Security Rules](https://firebase.google.com/docs/rules) - Database security
- [OWASP Security Guidelines](https://owasp.org/) - Security best practices

### **🛠️ Development Tools**

- [VS Code Extensions](./docs/VSCODE_SETUP.md) - Recommended development setup
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Browser debugging
- [Firebase CLI](https://firebase.google.com/docs/cli) - Command-line tools

---

## 📞 Support & Contact Information

<table>
<tr>
<td width="50%">

### **🚨 Emergency Contacts**

- **Security Incidents**: `security@dupp.com`
- **Emergency Hotline**: `+49-XXX-XXX-XXXX` (24/7)
- **Production Issues**: [PagerDuty Escalation]
- **GDPR/Legal Issues**: `privacy@dupp.com`

</td>
<td width="50%">

### **💬 Development Support**

- **Technical Questions**: `tech@dupp.com`
- **Code Reviews**: [GitHub Discussions]
- **Architecture Decisions**: `architecture@dupp.com`
- **Feature Requests**: `product@dupp.com`

</td>
</tr>
</table>

### **📋 Support Process**

1. **Search Documentation** - Check this hub and specific docs first
2. **Check GitHub Issues** - Look for existing issues/discussions
3. **Internal Slack** - `#dev-support` for quick questions
4. **Email Support** - For complex technical issues
5. **Emergency Escalation** - For security/production incidents only

---

## 🆕 What's New & Roadmap

### **📅 Recent Updates (August 2025)**

- ✅ **Security Overhaul**: Complete security architecture implementation
- ✅ **GDPR Compliance**: Full European data protection compliance
- ✅ **BigBuy Integration**: Automated dropshipping with stock sync
- ✅ **Admin Dashboard**: Complete administrative interface
- ✅ **Documentation Hub**: Comprehensive developer documentation

### **🎯 Current Sprint (Q3 2025)**

- 🔄 **Multi-Factor Authentication**: Enhanced admin security
- 🔄 **Performance Optimization**: Core Web Vitals improvements
- 🔄 **Mobile App**: React Native development
- 🔄 **Advanced Analytics**: AI-powered business intelligence

### **🚀 Upcoming Releases**

<details>
<summary><strong>Q4 2025 - Enhanced Security & Performance</strong></summary>

- **Multi-Factor Authentication**: Hardware keys, TOTP, SMS
- **Advanced Threat Detection**: AI-powered security monitoring
- **Performance Optimization**: Sub-second page loads, aggressive caching
- **Mobile PWA**: Offline capabilities, push notifications
- **Advanced Analytics**: Predictive analytics, customer insights

</details>

<details>
<summary><strong>Q1 2026 - AI & Personalization</strong></summary>

- **AI Product Recommendations**: Machine learning-powered suggestions
- **Personalized Shopping**: Dynamic UI based on user behavior
- **Chatbot Integration**: AI customer support assistant
- **Inventory Prediction**: AI-driven stock management
- **Dynamic Pricing**: Market-responsive pricing algorithms

</details>

<details>
<summary><strong>Q2 2026 - Global Expansion</strong></summary>

- **Multi-Currency Support**: Real-time exchange rates
- **Internationalization**: Multi-language support
- **Regional Compliance**: Country-specific legal requirements
- **Global CDN**: Worldwide performance optimization
- **Multi-Warehouse**: International fulfillment centers

</details>

---

## 📊 Platform Status & Metrics

### **🔋 System Health**

<table>
<tr>
<td>🛡️ **Security Score**</td><td>96/100 ✅</td>
<td>📊 **Performance**</td><td>92/100 ✅</td>
</tr>
<tr>
<td>🧪 **Test Coverage**</td><td>85% ✅</td>
<td>♿ **Accessibility**</td><td>AA Compliant ✅</td>
</tr>
<tr>
<td>🌍 **GDPR Status**</td><td>Compliant ✅</td>
<td>⏱️ **Uptime**</td><td>99.9% ✅</td>
</tr>
</table>

### **📈 Development Metrics**

- **Documentation Coverage**: 95% complete
- **API Endpoint Coverage**: 100% documented
- **Code Quality Score**: A+ grade
- **Dependency Security**: No high/critical vulnerabilities
- **Build Success Rate**: 98.5% (last 30 days)

---

## 📝 Contributing to Documentation

### **🔧 How to Contribute**

1. **Identify Gap**: Find missing or outdated documentation
2. **Create Issue**: Use [GitHub Issues] to propose changes
3. **Fork & Branch**: Create feature branch for documentation updates
4. **Follow Style Guide**: Use [Documentation Style Guide](./DOCUMENTATION_STYLE.md)
5. **Submit PR**: Request review from documentation maintainers

### **📋 Documentation Standards**

- **Clarity**: Write for the intended audience level
- **Completeness**: Include all necessary information
- **Consistency**: Follow established patterns and formatting
- **Currency**: Keep information up-to-date with codebase
- **Code Examples**: Include practical, working examples

### **🔄 Review Process**

- All documentation PRs require review from 2+ team members
- Technical accuracy verified by subject matter experts
- Language and clarity reviewed by technical writers
- Changes deployed automatically after approval

---

<footer>
<div align="center">

---

**🏢 düpp E-Commerce Platform**  
_Built with ❤️ for the European market_

**Security-first • Privacy-focused • Enterprise-grade • Developer-friendly**

📧 Contact: [tech@dupp.com](mailto:tech@dupp.com) | 🐛 Issues: [GitHub](https://github.com/dupp/issues) | 📚 Updates: [Changelog](./RELEASE_NOTES.md)

_Last updated: August 3, 2025 • Version 2.0 • Next review: November 3, 2025_

</div>
</footer>
