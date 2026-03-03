// =============================================================================
// Atomiq SEO Cloudflare Worker
// Injects JSON-LD structured data, per-route meta tags, OG tags, and Twitter
// cards into every page via HTMLRewriter. Deploy this as a Cloudflare Worker
// sitting in front of your Vercel origin.
// =============================================================================

const SITE_URL = "https://explorer.atomiq.network";
const SITE_NAME = "Atomiq Explorer";
const OG_IMAGE = "https://pbs.twimg.com/profile_images/2008310834989293568/AhH9FWF5_400x400.png";
const TWITTER_HANDLE = "@TheAtomiqChain";
const CASINO_URL = "https://casino.atomiq.network";

// -----------------------------------------------------------------------------
// Shared schema entities (referenced via @id across all routes)
// -----------------------------------------------------------------------------

function organizationSchema() {
  return {
    "@type": ["Organization", "Brand"],
    "@id": `${SITE_URL}/#organization`,
    name: "Atomiq Protocol",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: OG_IMAGE,
      width: 400,
      height: 400,
    },
    description:
      "Atomiq is a high-performance, BFT-validated blockchain that lets operators spin up fully on-chain, non-custodial casinos with provably fair games and real-time settlement. It runs the game + VRF layer and settles outcomes on Solana for fast finality and public auditability.",
    sameAs: ["https://x.com/TheAtomiqChain"],
    knowsAbout: [
      "On-Chain Gambling",
      "BFT Validated Casino",
      "Provably Fair VRF Casino",
      "Non-Custodial Crypto Casino",
      "Verifiable Random Function Betting",
      "Real-Time Settlement Casino",
      "Solana Settlement Gambling",
      "GambleFi Layer 1",
      "GambleFi Blockchain",
      "On-Chain Bet Verification",
      "Auditable Blockchain Casino",
      "Byzantine Fault Tolerant Gaming",
      "ECVRF Provably Fair",
      "Layer 1 Gaming Blockchain",
      "CometBFT Consensus",
      "Web3 Gaming",
    ],
    owns: { "@id": `${CASINO_URL}/#website` },
  };
}

function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    description:
      "The official block explorer for Atomiq Protocol — a BFT-validated, provably fair on-chain gambling blockchain with VRF verification and Solana settlement.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/verify/{search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

function breadcrumbSchema(items) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// -----------------------------------------------------------------------------
// Route-specific schema builders
// -----------------------------------------------------------------------------

function explorerAppSchema() {
  return {
    "@type": "WebApplication",
    "@id": `${SITE_URL}/#webapp`,
    name: "Atomiq Explorer",
    url: `${SITE_URL}/`,
    applicationCategory: "BlockchainApplication",
    operatingSystem: "Web",
    description:
      "Real-time on-chain gambling block explorer for the Atomiq BFT-validated blockchain. View bets, verify VRF proofs, and audit provably fair casino outcomes with Solana settlement.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: { "@id": `${SITE_URL}/#organization` },
    browserRequirements: "Requires JavaScript. Requires a modern browser.",
    softwareHelp: { "@id": `${SITE_URL}/about` },
  };
}

function faqPageSchema() {
  const faqs = [
    {
      q: "What is Atomiq Protocol and how does it work?",
      a: "Atomiq Protocol is a dedicated, high-performance Layer 1 blockchain engineered specifically for on-chain gambling and betting. Unlike general-purpose blockchains, Atomiq is purpose-built for gaming throughput using BFT (Byzantine Fault Tolerance) consensus — the same approach used by Hyperliquid. It runs the game logic and VRF (Verifiable Random Function) layer natively, then settles outcomes on Solana for fast finality and full public auditability. Every bet, from the millisecond a user clicks 'wager' to funds landing back in their wallet, is recorded on-chain and publicly verifiable.",
    },
    {
      q: "Why are most crypto casinos not truly provably fair?",
      a: "Most crypto casinos today are black boxes. They ask players to deposit funds into smart contracts they can't read, run by centralized teams on congested general-purpose blockchains. Many rely on federated setups where a small set of insiders control critical components like randomness generation and execution, meaning the house can theoretically manipulate outcomes or freeze funds. Players are forced to trust the operator — defeating the core promise of crypto. Atomiq solves this by making every step fully on-chain and publicly verifiable, with no hidden processes or centralized control over randomness.",
    },
    {
      q: "How does BFT consensus work for on-chain gambling?",
      a: "Atomiq uses an advanced Byzantine Fault Tolerance (BFT) consensus mechanism to validate every gambling transaction instantly. BFT consensus ensures that even if some validators are malicious or offline, the network reaches agreement on every bet outcome. This means the entire backend is fully transparent and immutable — there are no hidden steps, no optimistic assumptions, and no waiting. Every bet is BFT-validated in real time, making Atomiq's on-chain casino infrastructure faster and more trustworthy than application-layer casino solutions built on general-purpose chains.",
    },
    {
      q: "What is provably fair gaming and how does VRF verification work?",
      a: "Provably fair gaming uses cryptographic proofs to guarantee that every game outcome is fair and unbiased. Atomiq implements this using ECVRF (Elliptic Curve Verifiable Random Function) with the SECP256K1_SHA256_TAI cipher suite, providing RFC 9381 compliant cryptographic randomness. Each game outcome combines unpredictable blockchain data (block hashes, timestamps) with transaction details (wallet address, nonce) to produce a unique, verifiable random output. The VRF produces both a cryptographic proof and a deterministic output — anyone can independently verify that the result was not manipulated by any party, including the casino operators.",
    },
    {
      q: "How does Atomiq's non-custodial casino model protect players?",
      a: "Atomiq is fully non-custodial, meaning players always retain control of their funds. Unlike traditional crypto casinos that require depositing into opaque smart contracts controlled by the operator, Atomiq's on-chain architecture ensures that funds are handled transparently through BFT-validated transactions. The VRF randomness layer is publicly auditable, settlement happens on Solana for fast finality, and no single party can freeze or redirect player funds. This eliminates the counterparty risk inherent in custodial gambling platforms.",
    },
    {
      q: "What makes Atomiq different from other blockchain casino platforms?",
      a: "While competing platforms like Proov Network are applications built on top of general-purpose blockchains like Solana (inheriting their congestion and downtime risks), Atomiq is a sovereign blockchain optimized solely for gaming throughput. Atomiq is 80% faster than Solana for bet processing, uses on-chain VRF for provably fair outcomes rather than opaque private processes, and provides full public auditability in real time. The combination of a dedicated BFT Layer 1, native VRF game logic, and Solana settlement creates an architecture no application-layer solution can match.",
    },
    {
      q: "How does Solana settlement work with Atomiq's on-chain gambling?",
      a: "Atomiq runs its game logic and VRF randomness layer on its own BFT-validated Layer 1 chain for maximum speed and gaming-specific throughput. Final outcomes are then settled on Solana, leveraging Solana's fast finality and deep liquidity for the payout layer. This hybrid architecture gives Atomiq the best of both worlds: a purpose-built gaming chain for speed and fairness, plus Solana's ecosystem for settlement, public auditability, and interoperability with the broader DeFi and GambleFi ecosystem.",
    },
    {
      q: "How can I verify that a bet on Atomiq was fair?",
      a: "Every bet on Atomiq can be independently verified using the Atomiq Explorer. Navigate to the Verify page, enter the VRF public key and VRF proof from your bet transaction, and the system will cryptographically confirm the outcome was fair. The verification uses ECVRF with Ed25519 key management — the same cryptographic standard used in enterprise security. You can also browse all bets on the Explorer homepage and click any transaction to see its full VRF proof and on-chain verification data.",
    },
  ];

  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/about#faqpage`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

function howToVerifySchema() {
  return {
    "@type": "HowTo",
    "@id": `${SITE_URL}/verify#howto`,
    name: "How to Verify a Provably Fair Bet on Atomiq",
    description:
      "Step-by-step guide to independently verify any on-chain gambling outcome using ECVRF cryptographic proofs on the Atomiq blockchain.",
    totalTime: "PT2M",
    tool: [
      { "@type": "HowToTool", name: "Web browser" },
      { "@type": "HowToTool", name: "VRF public key from your bet transaction" },
      { "@type": "HowToTool", name: "VRF proof from your bet transaction" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Navigate to the Atomiq Verify page",
        text: "Open the Atomiq Explorer and go to the Verify page at explorer.atomiq.network/verify, or click any bet transaction from the Explorer homepage to auto-load its verification data.",
        url: `${SITE_URL}/verify`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter the VRF Public Key",
        text: "Paste the VRF public key from your bet transaction into the 'VRF Public Key' field. This is the Ed25519 public key used by the Atomiq VRF system for that specific bet.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Enter the VRF Proof",
        text: "Paste the ECVRF proof from your bet transaction into the 'VRF Proof' field. This is the base64-encoded cryptographic proof that ties the randomness to the specific blockchain state at the time of your bet.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Click Verify Result",
        text: "Click the 'Verify Result' button. The system will cryptographically validate the VRF proof against the public key and confirm whether the game outcome was provably fair and unmanipulated.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Review the verification result",
        text: "The verification result will show whether the ECVRF proof is valid, confirming the bet outcome was determined by verifiable on-chain randomness that no party — including the casino — could have manipulated.",
      },
    ],
  };
}

function techArticleSchema(route) {
  return {
    "@type": "TechArticle",
    "@id": `${SITE_URL}${route}#article`,
    headline: "Provably Fair VRF Bet Verification on Atomiq",
    description:
      "Technical guide to verifying on-chain gambling outcomes using ECVRF cryptographic proofs on the Atomiq BFT-validated blockchain.",
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
    about: [
      "Provably Fair Gambling",
      "VRF Verification",
      "ECVRF Cryptographic Proofs",
      "On-Chain Bet Verification",
      "Non-Custodial Casino Verification",
    ],
    proficiencyLevel: "Beginner",
  };
}

function gameSchema(name, description, route) {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}${route}#game`,
    name: name,
    url: `${SITE_URL}${route}`,
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    description: description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: { "@id": `${SITE_URL}/#organization` },
  };
}

// -----------------------------------------------------------------------------
// Route SEO configuration map
// -----------------------------------------------------------------------------

const ROUTE_CONFIG = {
  "/": {
    title: "Atomiq Explorer | On-Chain Gambling Block Explorer & BFT-Validated Bets",
    description:
      "Explore real-time on-chain gambling activity on Atomiq — a BFT-validated, provably fair casino blockchain with VRF verification and Solana settlement.",
    ogType: "website",
    schema: () => [
      organizationSchema(),
      websiteSchema(),
      explorerAppSchema(),
      breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }]),
    ],
  },
  "/explore": {
    title: "Atomiq Explorer | On-Chain Gambling Block Explorer & BFT-Validated Bets",
    description:
      "Browse all BFT-validated on-chain bets in real time. Verify provably fair VRF outcomes, track wagering activity, and audit the Atomiq gambling blockchain.",
    ogType: "website",
    schema: () => [
      organizationSchema(),
      websiteSchema(),
      explorerAppSchema(),
      breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Explore", url: `${SITE_URL}/explore` },
      ]),
    ],
  },
  "/about": {
    title: "About Atomiq Protocol | The GambleFi Layer 1 for Provably Fair On-Chain Casinos",
    description:
      "Learn how Atomiq uses BFT consensus and ECVRF to power fully non-custodial, provably fair on-chain casinos with real-time Solana settlement. The Hyperliquid of gambling.",
    ogType: "article",
    schema: () => [
      organizationSchema(),
      websiteSchema(),
      faqPageSchema(),
      breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "About", url: `${SITE_URL}/about` },
      ]),
    ],
  },
  "/verify": {
    title: "Verify Provably Fair Bets | VRF Proof Verification on Atomiq",
    description:
      "Independently verify any on-chain gambling outcome using ECVRF cryptographic proofs. Auditable, non-custodial, BFT-validated bet verification on the Atomiq blockchain.",
    ogType: "website",
    schema: () => [
      organizationSchema(),
      websiteSchema(),
      howToVerifySchema(),
      techArticleSchema("/verify"),
      breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Verify", url: `${SITE_URL}/verify` },
      ]),
    ],
  },
  "/verify/:txId": {
    title: "Bet Verification | Atomiq Provably Fair VRF Proof",
    description:
      "Cryptographic verification of an on-chain gambling outcome. View the full ECVRF proof, VRF output, and BFT-validated transaction data for this provably fair bet.",
    ogType: "website",
    schema: (pathname) => [
      organizationSchema(),
      websiteSchema(),
      techArticleSchema(pathname),
      breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Verify", url: `${SITE_URL}/verify` },
        { name: "Transaction", url: `${SITE_URL}${pathname}` },
      ]),
    ],
  },
  "/test": {
    title: "Test Games | Provably Fair On-Chain Casino Games on Atomiq",
    description:
      "Try provably fair casino games powered by ECVRF on the Atomiq BFT-validated blockchain. Every outcome is verifiable, non-custodial, and settled on Solana.",
    ogType: "website",
    schema: () => [
      organizationSchema(),
      websiteSchema(),
      breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Test Games", url: `${SITE_URL}/test` },
      ]),
    ],
  },
  "/test/coinflip": {
    title: "Provably Fair Coin Flip | VRF-Powered On-Chain Casino Game",
    description:
      "Play a provably fair coin flip powered by ECVRF on the Atomiq blockchain. Every flip is BFT-validated, non-custodial, and independently verifiable with on-chain VRF proofs.",
    ogType: "website",
    schema: () => [
      organizationSchema(),
      websiteSchema(),
      gameSchema(
        "Atomiq Provably Fair Coin Flip",
        "A provably fair coin flip game powered by ECVRF cryptographic randomness on the Atomiq BFT-validated blockchain. Every outcome is verifiable, non-custodial, and settled on Solana.",
        "/test/coinflip"
      ),
      breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Test Games", url: `${SITE_URL}/test` },
        { name: "Coin Flip", url: `${SITE_URL}/test/coinflip` },
      ]),
    ],
  },
  "/test/slots": {
    title: "Provably Fair Slots | On-Chain Slot Machine with VRF Verification",
    description:
      "Play provably fair slots on the Atomiq blockchain. Each spin uses ECVRF for verifiable randomness, BFT-validated execution, and non-custodial Solana settlement.",
    ogType: "website",
    schema: () => [
      organizationSchema(),
      websiteSchema(),
      gameSchema(
        "Atomiq Provably Fair Slots",
        "A provably fair slot machine powered by ECVRF cryptographic randomness on the Atomiq BFT-validated blockchain. Every spin is verifiable, non-custodial, and settled on Solana.",
        "/test/slots"
      ),
      breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Test Games", url: `${SITE_URL}/test` },
        { name: "Slots", url: `${SITE_URL}/test/slots` },
      ]),
    ],
  },
};

// Casino subdomain config (kept separate and simple)
const CASINO_CONFIG = {
  "/": {
    title: "Atomiq Casino | Provably Fair On-Chain Gambling with VRF & Solana Settlement",
    description:
      "The flagship non-custodial betting platform powered by the Atomiq BFT-validated Layer 1 blockchain. Provably fair games, ECVRF randomness, real-time Solana settlement.",
    ogType: "website",
    schema: () => [
      organizationSchema(),
      {
        "@type": "WebSite",
        "@id": `${CASINO_URL}/#website`,
        url: `${CASINO_URL}/`,
        name: "Atomiq Casino",
        description:
          "The flagship provably fair betting and gaming platform powered by the Atomiq Protocol BFT-validated Layer 1 blockchain with ECVRF randomness and Solana settlement.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-US",
      },
    ],
  },
};

// -----------------------------------------------------------------------------
// Route matching
// -----------------------------------------------------------------------------

function matchRoute(hostname, pathname) {
  if (hostname === "casino.atomiq.network") {
    return { config: CASINO_CONFIG["/"], pathname, baseUrl: CASINO_URL };
  }

  if (hostname !== "explorer.atomiq.network") return null;

  const exactMatch = ROUTE_CONFIG[pathname];
  if (exactMatch) return { config: exactMatch, pathname, baseUrl: SITE_URL };

  if (pathname.startsWith("/verify/") && pathname.length > "/verify/".length) {
    return { config: ROUTE_CONFIG["/verify/:txId"], pathname, baseUrl: SITE_URL };
  }

  return null;
}

// -----------------------------------------------------------------------------
// HTMLRewriter handlers
// -----------------------------------------------------------------------------

class TitleRewriter {
  constructor(title) {
    this.title = title;
  }
  element(element) {
    element.setInnerContent(this.title);
  }
}

class MetaDescriptionRewriter {
  constructor(description) {
    this.description = description;
  }
  element(element) {
    if (element.getAttribute("name") === "description") {
      element.setAttribute("content", this.description);
    }
  }
}

class CanonicalRewriter {
  constructor(pathname, baseUrl) {
    this.canonicalUrl = `${baseUrl}${pathname === "/" ? "/" : pathname}`;
  }
  element(element) {
    element.setAttribute("href", this.canonicalUrl);
  }
}

class HeadAppender {
  constructor(config, pathname, baseUrl) {
    this.config = config;
    this.pathname = pathname;
    this.baseUrl = baseUrl;
  }

  element(element) {
    const { config, pathname, baseUrl } = this;
    const canonicalUrl = `${baseUrl}${pathname === "/" ? "/" : pathname}`;
    const tags = [];

    // Open Graph
    tags.push(`<meta property="og:title" content="${escapeAttr(config.title)}" />`);
    tags.push(`<meta property="og:description" content="${escapeAttr(config.description)}" />`);
    tags.push(`<meta property="og:url" content="${canonicalUrl}" />`);
    tags.push(`<meta property="og:type" content="${config.ogType}" />`);
    tags.push(`<meta property="og:image" content="${OG_IMAGE}" />`);
    tags.push(`<meta property="og:image:width" content="400" />`);
    tags.push(`<meta property="og:image:height" content="400" />`);
    tags.push(`<meta property="og:site_name" content="${SITE_NAME}" />`);
    tags.push(`<meta property="og:locale" content="en_US" />`);

    // Twitter Card
    tags.push(`<meta name="twitter:card" content="summary" />`);
    tags.push(`<meta name="twitter:site" content="${TWITTER_HANDLE}" />`);
    tags.push(`<meta name="twitter:creator" content="${TWITTER_HANDLE}" />`);
    tags.push(`<meta name="twitter:title" content="${escapeAttr(config.title)}" />`);
    tags.push(`<meta name="twitter:description" content="${escapeAttr(config.description)}" />`);
    tags.push(`<meta name="twitter:image" content="${OG_IMAGE}" />`);

    // JSON-LD structured data
    const schemaGraph = typeof config.schema === "function"
      ? config.schema(pathname)
      : config.schema;

    if (schemaGraph && schemaGraph.length > 0) {
      const jsonLd = {
        "@context": "https://schema.org",
        "@graph": schemaGraph,
      };
      tags.push(
        `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
      );
    }

    element.append(tags.join("\n"), { html: true });
  }
}

function escapeAttr(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// -----------------------------------------------------------------------------
// Worker entry point
// -----------------------------------------------------------------------------

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const match = matchRoute(url.hostname, url.pathname);

    // No SEO config for this route — pass through unchanged
    if (!match) return fetch(request);

    const response = await fetch(request);
    const { config, pathname, baseUrl } = match;

    return new HTMLRewriter()
      .on("title", new TitleRewriter(config.title))
      .on('meta[name="description"]', new MetaDescriptionRewriter(config.description))
      .on('link[rel="canonical"]', new CanonicalRewriter(pathname, baseUrl))
      .on("head", new HeadAppender(config, pathname, baseUrl))
      .transform(response);
  },
};
