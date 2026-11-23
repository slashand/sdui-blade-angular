import { SduiElementType } from "@slashand/sdui-blade-core";
import type { SduiBladeNode } from "@slashand/sdui-blade-core";

export interface OmniverseApp {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  payload: {
    version: string;
    blade: SduiBladeNode;
  };
}

export const CORE_PILLARS: OmniverseApp[] = [
  {
    id: "fintech-crypto",
    name: "Crypto Exchange Desk",
    category: "FinTech",
    description: "High-frequency trading interface with live spread alerts and deep portfolio sections.",
    icon: "🏦",
    payload: {
      version: "1.0",
      blade: {
        id: "blade-crypto-root",
        type: SduiElementType.Blade,
        properties: {
          title: "Trading Desk: BTC/USD",
          subtitle: "Institutional Clearing Node",
          width: "full",
          toolbar: [
            {
              id: "crypto-tbar-1",
              type: SduiElementType.Button,
              properties: { label: "Export Tick Data", action: { type: "dispatch" } }
            }
          ],
          footer: [
            {
              id: "crypto-ftr-1",
              type: SduiElementType.Button,
              properties: {
                label: "Analyze Order Book (Push Blade)",
                action: {
                  type: "navigate",
                  payload: {
                    id: "blade-crypto-deep",
                    type: SduiElementType.Blade,
                    properties: {
                      title: "Deep Order Book",
                      subtitle: "Aggregated Liquidity Clusters",
                      width: "medium"
                    },
                    children: [
                      {
                        id: "deep-alert-1",
                        type: SduiElementType.Alert,
                        properties: { type: "info", title: "Secure WebSocket", message: "Streaming L2 order book data at 12ms ping." }
                      }
                    ]
                  }
                }
              }
            }
          ]
        },
        children: [
          {
            id: "crypto-chart",
            type: SduiElementType.ExtensionMount,
            properties: { mountPoint: "crypto_chart_tv" }
          },
          {
            id: "crypto-alert",
            type: SduiElementType.Alert,
            properties: {
              type: "warning",
              title: "Volatility Spike Detected",
              message: "Spread exceeds 400 BPS. Leverage strictly capped at 5x."
            }
          },
          {
            id: "crypto-metrics",
            type: SduiElementType.Grid,
            properties: { columns: 3, gap: 4 },
            children: [
              { id: "cm-1", type: SduiElementType.StatusBadge, properties: { status: "info", text: "24h Vol: $4.2B" } },
              { id: "cm-2", type: SduiElementType.StatusBadge, properties: { status: "success", text: "Funding: 0.01%" } },
              { id: "cm-3", type: SduiElementType.StatusBadge, properties: { status: "error", text: "Index: $64,192" } }
            ]
          },
          {
            id: "crypto-pivot",
            type: SduiElementType.Pivot,
            properties: {
              items: [
                { title: "Live Order Book", targetId: "tab-book" },
                { title: "Account Portfolio", targetId: "tab-port" }
              ]
            }
          },
          {
            id: "crypto-section",
            type: SduiElementType.Section,
            properties: { title: "Level 2 Liquidity" },
            children: [
              {
                id: "crypto-grid",
                type: SduiElementType.DataGrid,
                properties: {
                  columns: [{ key: "price", name: "Price (USD)" }, { key: "amount", name: "Amount (BTC)" }, { key: "total", name: "Total (USD)" }],
                  rows: [
                    { price: "64,215.50", amount: "1.2405", total: "$79,659.32" },
                    { price: "64,210.00", amount: "14.500", total: "$931,045.00" },
                    { price: "64,198.25", amount: "3.1142", total: "$199,936.88" },
                    { price: "64,190.00", amount: "88.021", total: "$5,650,067.99" }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: "health-emr",
    name: "Patient EMR Tracker",
    category: "Healthcare",
    description: "Secure medical records dashboard with deeply nested vitals and telemetry badges.",
    icon: "⚕️",
    payload: {
      version: "1.0",
      blade: {
        id: "blade-emr-root",
        type: SduiElementType.Blade,
        properties: {
          title: "Patient: Doe, John",
          subtitle: "DOB: 1984-06-12 | MRN: 94811-A",
          width: "full"
        },
        children: [
          {
            id: "emr-alert",
            type: SduiElementType.Alert,
            properties: {
              type: "error",
              title: "Severe Allergy",
              message: "Patient is highly allergic to Penicillin. DO NOT ADMINISTER."
            }
          },
          {
            id: "emr-vitals",
            type: SduiElementType.Section,
            properties: { title: "Live Telemetry" },
            children: [
              {
                id: "emr-grid",
                type: SduiElementType.Grid,
                properties: { columns: 4, gap: 4 },
                children: [
                  { id: "emr-badge-1", type: SduiElementType.StatusBadge, properties: { status: "success", text: "HR: 72 BPM" } },
                  { id: "emr-badge-2", type: SduiElementType.StatusBadge, properties: { status: "warning", text: "SpO2: 94%" } },
                  { id: "emr-badge-3", type: SduiElementType.StatusBadge, properties: { status: "error", text: "BP: 145/92" } },
                  { id: "emr-badge-4", type: SduiElementType.StatusBadge, properties: { status: "info", text: "Resp: 16/min" } }
                ]
              }
            ]
          },
          {
            id: "emr-meds",
            type: SduiElementType.Section,
            properties: { title: "Active Formulary" },
            children: [
              {
                id: "emr-med-grid",
                type: SduiElementType.DataGrid,
                properties: {
                  columns: [{ key: "drug", name: "Medication" }, { key: "dose", name: "Dosage" }, { key: "freq", name: "Frequency" }],
                  rows: [
                    { drug: "Lisinopril", dose: "10mg", freq: "PO Daily" },
                    { drug: "Atorvastatin", dose: "40mg", freq: "PO Nightly" },
                    { drug: "Metformin", dose: "500mg", freq: "BID w/ Meals" }
                  ]
                }
              }
            ]
          },
          {
            id: "emr-btn-row",
            type: SduiElementType.Row,
            properties: { justify: "end", gap: 3 },
            children: [
              { id: "emr-btn-cc", type: SduiElementType.Button, properties: { label: "Request Cardiology Consult", action: { type: "dispatch" } } },
              { id: "emr-btn", type: SduiElementType.Button, properties: { label: "Authorize Epinephrine", action: { type: "invoke", target: "/med/auth" } } }
            ]
          }
        ]
      }
    }
  },
  {
    id: "logistics-sc",
    name: "Global Supply Chain",
    category: "Logistics",
    description: "Tracking manifest for international container shipping and fleet route mapping.",
    icon: "🚢",
    payload: {
      version: "1.0",
      blade: {
        id: "blade-logistics-root",
        type: SduiElementType.Blade,
        properties: {
          title: "Vessel: EVER GIVEN II",
          subtitle: "Current Location: Suez Canal Approach",
          width: "full"
        },
        children: [
          {
            id: "logistics-map",
            type: SduiElementType.ExtensionMount,
            properties: { mountPoint: "logistics_live_map" }
          },
          {
            id: "logistics-grid",
            type: SduiElementType.Grid,
            properties: { columns: 3, gap: 4 },
            children: [
              { id: "log-1", type: SduiElementType.StatusBadge, properties: { status: "info", text: "Active Routes: 1,402" } },
              { id: "log-2", type: SduiElementType.StatusBadge, properties: { status: "error", text: "Delayed: 38" } },
              { id: "log-3", type: SduiElementType.StatusBadge, properties: { status: "success", text: "Delivered (24h): 8,900" } }
            ]
          },
          {
            id: "logistics-section",
            type: SduiElementType.Section,
            properties: { title: "Vessel Tracking Matrix" },
            children: [
              {
                id: "logistics-datagrid",
                type: SduiElementType.DataGrid,
                properties: {
                  columns: [{ key: "vessel", name: "Vessel ID" }, { key: "origin", name: "Origin" }, { key: "dest", name: "Destination" }, { key: "eta", name: "ETA" }],
                  rows: [
                    { vessel: "MSC Isabella", origin: "Shanghai", dest: "Los Angeles", eta: "2 Days" },
                    { vessel: "Ever Given", origin: "Rotterdam", dest: "Felixstowe", eta: "Delayed (4h)" },
                    { vessel: "Maersk Mc-Kinney", origin: "Singapore", dest: "Hamburg", eta: "On Time" }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: "cyber-soc",
    name: "SOC Firewall Console",
    category: "CyberSecurity",
    description: "Zero-trust network intrusion orchestrator with deep JSON log interrogation.",
    icon: "🛡️",
    payload: {
      version: "1.0",
      blade: {
        id: "blade-sec-root",
        type: SduiElementType.Blade,
        properties: {
          title: "Intrusion Detection: Node Alpha",
          subtitle: "Active Threats: 14",
          width: "full"
        },
        children: [
          {
            id: "cyber-grid",
            type: SduiElementType.Grid,
            properties: { columns: 2, gap: 4 },
            children: [
              {
                id: "cyber-alert-1",
                type: SduiElementType.Alert,
                properties: { type: "error", title: "CRITICAL BREACH SEV-1", message: "Multiple unauthorized lateral movements detected in VPC Subnet-B." }
              },
              {
                id: "cyber-alert-2",
                type: SduiElementType.Alert,
                properties: { type: "warning", title: "Anomaly", message: "Unusual outbound egress spike (4.2 TB) to unverified IP range." }
              }
            ]
          },
          {
            id: "cyber-section",
            type: SduiElementType.Section,
            properties: { title: "Threat Vector Topography" },
            children: [
              {
                id: "cyber-datagrid",
                type: SduiElementType.DataGrid,
                properties: {
                  columns: [{ key: "ip", name: "Source IP" }, { key: "vector", name: "Vector" }, { key: "status", name: "Status" }],
                  rows: [
                    { ip: "192.168.1.105", vector: "SQL Injection", status: "Blocked" },
                    { ip: "10.0.0.42", vector: "Ransomware Encrypt", status: "ACTIVE SEV-1" },
                    { ip: "Unknown", vector: "DDoS Mitigation", status: "Absorbing" }
                  ]
                }
              },
              {
                id: "cyber-row",
                type: SduiElementType.Row,
                properties: { justify: "end", gap: 3 },
                children: [
                  { id: "cyber-btn-lock", type: SduiElementType.Button, properties: { label: "Initiate VPC Lockdown", action: { type: "dispatch" } } },
                  { id: "cyber-btn-pcap", type: SduiElementType.Button, properties: { label: "Export PCAP", action: { type: "dispatch" } } }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: "ai-cluster",
    name: "AI Training Cluster",
    category: "DevOps",
    description: "Multi-modal model parameter configuration and compute shard telemetry.",
    icon: "🧠",
    payload: {
      version: "1.0",
      blade: {
        id: "blade-ai-root",
        type: SduiElementType.Blade,
        properties: {
          title: "GPT-7 Training Run",
          subtitle: "Epoch 14/1000 | Loss: 0.041",
          width: "full"
        },
        children: [
          {
            id: "ai-alert",
            type: SduiElementType.Alert,
            properties: {
              type: "success",
              title: "Gradient Checkpoint Saved",
              message: "Checkpoint 14 successfully replicated to S3 Deep Glacier."
            }
          },
          {
            id: "ai-sec",
            type: SduiElementType.Section,
            properties: { title: "GPU Cluster Status" },
            children: [
              {
                id: "ai-b1",
                type: SduiElementType.StatusBadge,
                properties: { status: "success", text: "H100 Array: 100% Utilized" }
              },
              {
                id: "ai-b2",
                type: SduiElementType.StatusBadge,
                properties: { status: "warning", text: "Thermal Throttling near Target" }
              },
              {
                id: "ai-btn",
                type: SduiElementType.Button,
                properties: { label: "Inject Extra Compute Shards", action: { type: "invoke", target: "/scale" } }
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: "crm-sales",
    name: "Enterprise CRM Pipeline",
    category: "Sales",
    description: "Multi-region opportunity tracker with forecasted revenue grids and account pivoting.",
    icon: "📈",
    payload: {
      version: "1.0",
      blade: {
        id: "blade-crm",
        type: SduiElementType.Blade,
        properties: { title: "Q3 Deal Pipeline", subtitle: "Region: EMEA North", width: "full" },
        children: [
          {
            id: "crm-grid",
            type: SduiElementType.Grid,
            properties: { columns: 3, gap: 4 },
            children: [
              { id: "crm-badge-1", type: SduiElementType.StatusBadge, properties: { status: "success", text: "Won: $14.2M" } },
              { id: "crm-badge-2", type: SduiElementType.StatusBadge, properties: { status: "warning", text: "Pipeline: $38.5M" } },
              { id: "crm-badge-3", type: SduiElementType.StatusBadge, properties: { status: "info", text: "Active Reps: 14" } }
            ]
          },
          {
            id: "crm-section",
            type: SduiElementType.Section,
            properties: { title: "High-Probability Opportunities" },
            children: [
              {
                id: "crm-datagrid",
                type: SduiElementType.DataGrid,
                properties: {
                  columns: [{ key: "client", name: "Account" }, { key: "stage", name: "Stage" }, { key: "val", name: "Value ($)" }],
                  rows: [ 
                    { client: "Acme Corp", stage: "Negotiation", val: "1,250,000" }, 
                    { client: "GlobalNet", stage: "Discovery", val: "450,000" },
                    { client: "Stark Industries", stage: "Contract Sent", val: "8,900,000" },
                    { client: "Wayne Enterprises", stage: "Procurement", val: "2,100,000" }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: "media-render",
    name: "Cloud Render Pipeline",
    category: "Media",
    description: "VFX job queue monitoring for 8K video rendering farms.",
    icon: "🎬",
    payload: {
      version: "1.0",
      blade: {
        id: "blade-media",
        type: SduiElementType.Blade,
        properties: { title: "Job Node #4A9", subtitle: "Project: Project Titan", width: "full" },
        children: [
          {
            id: "media-alert",
            type: SduiElementType.Alert,
            properties: { type: "warning", title: "Frame Dropped", message: "Frame 49,211 failed hash check. Retrying on Shard 7." }
          },
          {
            id: "media-btn",
            type: SduiElementType.Button,
            properties: { label: "Abort Render Job", action: { type: "dispatch" } }
          }
        ]
      }
    }
  },
  {
    id: "retail-pos",
    name: "Point of Sale (POS)",
    category: "Retail",
    description: "Tablet-optimized transaction terminal with heavy invoke buttons.",
    icon: "🛒",
    payload: {
      version: "1.0",
      blade: {
        id: "blade-pos",
        type: SduiElementType.Blade,
        properties: { title: "Register 14", subtitle: "Cashier: J. Smith", width: "full" },
        children: [
          {
            id: "pos-alert",
            type: SduiElementType.Alert,
            properties: { type: "success", title: "Gateway Active", message: "Stripe Terminal is connected." }
          },
          {
            id: "pos-btn",
            type: SduiElementType.Button,
            properties: { label: "Charge $42.50", action: { type: "dispatch" } }
          }
        ]
      }
    }
  },
  {
    id: "hr-payroll",
    name: "Global Payroll Ledger",
    category: "Human Resources",
    description: "Secure ledger for international wire clearing and compliance alerts.",
    icon: "👥",
    payload: {
      version: "1.0",
      blade: {
        id: "blade-payroll",
        type: SduiElementType.Blade,
        properties: { title: "September Execution", subtitle: "Clearance: Pending Level 2", width: "full" },
        children: [
          {
            id: "hr-pivot",
            type: SduiElementType.Pivot,
            properties: {
              items: [{ title: "Pending Approvals", targetId: "tp" }, { title: "Audit Logs", targetId: "ta" }]
            }
          },
          {
            id: "hr-btn",
            type: SduiElementType.Button,
            properties: { label: "Sign Cryptographically", action: { type: "dispatch" } }
          }
        ]
      }
    }
  },
  {
    id: "topology-stress",
    name: "SDUI Topology Stress Test",
    category: "Architecture",
    description: "Deep-nested CSS bounding box test. Cascades perfectly from full width down to a small terminal.",
    icon: "📐",
    payload: {
      version: "1.0",
      blade: {
        id: "blade-stress-root",
        type: SduiElementType.Blade,
        properties: { title: "Phase 1: Foundation", subtitle: "Root Workspace (w-full)", width: "full" },
        children: [
          {
            id: "stress-btn-1",
            type: SduiElementType.Button,
            properties: {
              label: "Spawn X-Large Dimensions (1125px)",
              action: {
                type: "navigate",
                payload: {
                  id: "blade-stress-xl",
                  type: SduiElementType.Blade,
                  properties: { title: "Phase 2: X-Large Overlay", subtitle: "Width Array: 1125px", width: "xlarge" },
                  children: [
                    {
                      id: "stress-btn-2",
                      type: SduiElementType.Button,
                      properties: {
                        label: "Spawn Large Dimensions (855px)",
                        action: {
                          type: "navigate",
                          payload: {
                            id: "blade-stress-l",
                            type: SduiElementType.Blade,
                            properties: { title: "Phase 3: Large Overlay", subtitle: "Width Array: 855px", width: "large" },
                            children: [
                              {
                                id: "stress-btn-3",
                                type: SduiElementType.Button,
                                properties: {
                                  label: "Spawn Medium Dimensions (585px)",
                                  action: {
                                    type: "navigate",
                                    payload: {
                                      id: "blade-stress-m",
                                      type: SduiElementType.Blade,
                                      properties: { title: "Phase 4: Medium Overlay", subtitle: "Width Array: 585px", width: "medium" },
                                      children: [
                                        {
                                          id: "stress-btn-4",
                                          type: SduiElementType.Button,
                                          properties: {
                                            label: "Spawn Small Dimensions (315px)",
                                            action: {
                                              type: "navigate",
                                              payload: {
                                                id: "blade-stress-s",
                                                type: SduiElementType.Blade,
                                                properties: { title: "Phase 5: Core Minimum", subtitle: "Width Array: 315px", width: "small" },
                                                children: [
                                                  {
                                                    id: "stress-alert",
                                                    type: SduiElementType.Alert,
                                                    properties: { type: "success", title: "Target Acquired", message: "You have successfully traversed all 5 architectural bounding boxes natively." }
                                                  }
                                                ]
                                              }
                                            }
                                          }
                                        }
                                      ]
                                    }
                                  }
                                }
                              }
                            ]
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    }
  }
];

/**
 * Mathematically generates an infinitely deep, randomized SDUI Manifest to prove
 * the renderer can absorb any generic JSON constraint without crashing.
 */
export function generateProceduralPayload(): OmniverseApp {
  const hash = Math.random().toString(36).substring(2, 9);
  
  const randomizedChildren: NonNullable<SduiBladeNode['children']> = [];
  
  // Random Alert
  if (Math.random() > 0.3) {
    const types = ["error", "warning", "info", "success"];
    randomizedChildren.push({
      id: `alert-${hash}`,
      type: SduiElementType.Alert,
      properties: {
        type: types[Math.floor(Math.random() * types.length)],
        title: `Procedural Event ${hash}`,
        message: `This alert was synthetically generated. Random metric: ${Math.floor(Math.random() * 1000)}.`
      }
    });
  }

  // Random Section with inner children
  const deepChildrenCount = Math.floor(Math.random() * 5) + 1;
  const innerChildren: NonNullable<SduiBladeNode['children']> = [];
  
  for (let i = 0; i < deepChildrenCount; i++) {
    const r = Math.random();
    if (r < 0.3) {
      innerChildren.push({
        id: `txt-${hash}-${i}`,
        type: SduiElementType.Text,
        properties: { value: `Synthetic data point logging entry #${i}.` }
      });
    } else if (r < 0.7) {
      innerChildren.push({
        id: `badge-${hash}-${i}`,
        type: SduiElementType.StatusBadge,
        properties: { status: "info", text: `Metric ${Math.random().toFixed(2)}` }
      });
    } else {
      innerChildren.push({
        id: `btn-${hash}-${i}`,
        type: SduiElementType.Button,
        properties: { label: `Action Node ${i}`, action: { type: "dispatch" } }
      });
    }
  }

  randomizedChildren.push({
    id: `sec-${hash}`,
    type: SduiElementType.Section,
    properties: { title: `Synthesized Block ${hash}` },
    children: innerChildren
  });

  return {
    id: `chaos-${hash}`,
    name: `Chaos Matrix ${hash}`,
    category: "Procedural",
    description: "A mathematically synthesized, 100% unique payload proving AST stability.",
    icon: "🌌",
    payload: {
      version: "1.0",
      blade: {
        id: `blade-proc-${hash}`,
        type: SduiElementType.Blade,
        properties: {
          title: `Procedural Node: ${hash.toUpperCase()}`,
          subtitle: "Infinite Synthesizer Engine",
          width: "full",
          toolbar: [
            { id: `tbar-${hash}`, type: SduiElementType.Button, properties: { label: `Sync Node ${hash}`, action: { type: "dispatch" } } }
          ],
          footer: [
            {
              id: `ftr-${hash}`,
              type: SduiElementType.Button,
              properties: {
                label: "Deep Dive (Stack Blade)",
                action: {
                  type: "navigate",
                  payload: {
                    id: `blade-deep-${hash}`,
                    type: SduiElementType.Blade,
                    properties: { title: `Nested Matrix ${hash}`, width: "medium" },
                    children: [
                      { id: `txt-${hash}`, type: SduiElementType.Text, properties: { value: "You have entered a nested procedural dimension." } }
                    ]
                  }
                }
              }
            },
            { id: `close-${hash}`, type: SduiElementType.Button, properties: { label: "Close workspace", action: { type: "close" } } }
          ]
        },
        children: randomizedChildren
      }
    }
  };
}
