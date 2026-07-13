(() => {
  "use strict";

  const PROTOCOL_VERSION = "2025-03-26";
  const REQUEST_TIMEOUT_MS = 45000;

  const SCENARIOS = Object.freeze({
    autonomous: {
      label: "Autonomous customer success",
      repo: "csm-aiteammate",
      endpoint: null,
      mode: "simulation",
      description: "Watch a customer event become governed work without a human prompt — then inspect the manager, sponsor and evidence views.",
      flow: ["Event", "Agent identity", "Seven-stage journey", "Supervision"],
      calls: [],
      callSummary: "event → Agent ID → seven-stage engine → deterministic route → supervised outcome",
      explainer: "The replay follows the repository's real stages and rule IDs using synthetic inputs. It makes no external or API requests, writes no data and cannot deliver customer outreach.",
      runLabel: "Run autonomous business event",
      render: renderAutonomous
    },
    retail: {
      label: "Frontline operations",
      repo: "retail-mcp",
      endpoint: "https://ca-retail-mcp-test.icysea-401f5140.uksouth.azurecontainerapps.io/mcp",
      description: "Combine local demand signals, workforce disruption and stock into one opening-shift brief.",
      explainer: "The browser performs an MCP initialise handshake, calls only the fixed read-only tools, reads their ui:// resources, injects tool output into a sandboxed Apps SDK host, and closes stateful sessions.",
      flow: ["Weather", "Travel", "Stock", "Shift brief"],
      calls: [
        {
          name: "get_weather_forecast",
          arguments: { store_id: "GLD001" },
          widgetLabel: "Weather & footfall",
          widgetUri: "ui://widget/weather.html"
        },
        {
          name: "get_travel_updates",
          arguments: { store_id: "GLD001" },
          widgetLabel: "Travel & staffing",
          widgetUri: "ui://widget/travel_updates.html"
        },
        {
          name: "get_stock_levels",
          arguments: { store_id: "GLD001", category: "all" },
          widgetLabel: "Stock health",
          widgetUri: "ui://widget/stock.html"
        }
      ],
      fallback: [
        {
          structuredContent: {
            data: {
              store_name: "Guildford High Street",
              weather: {
                current: { condition: "Overcast", temp_c: 12, feels_like_c: 9 },
                forecast_3day: [{ footfall_impact: "+18%", impact_label: "Rain drives customers in — expect a busy morning rush" }],
                local_events: [{ event: "Guildford Live Music Festival", footfall_impact: "+35%", note: "Stock up on cold drinks and grab-and-go food." }]
              }
            }
          }
        },
        {
          structuredContent: {
            data: {
              travel: {
                overall_impact: "High",
                impact_summary: "Rail disruption may delay 2 staff members. Expect higher morning footfall from stranded commuters.",
                disruptions: [{ severity: "Major", title: "Guildford line delays", expected_resolution: "11:30" }],
                recommended_actions: [
                  "Contact the two affected team members to confirm their ETA",
                  "Staff up the counter from 7:30 for the commuter surge"
                ]
              }
            }
          }
        },
        {
          structuredContent: {
            data: {
              critical_count: 3,
              low_count: 7,
              items: [
                { name: "Coconut Milk 1L", current_level: 0.5, unit: "units", status: "Critical" },
                { name: "16oz Cups (500pk)", current_level: 1.1, unit: "packs", status: "Critical" },
                { name: "Cocoa Powder 1kg", current_level: 0.1, unit: "units", status: "Critical" }
              ]
            }
          }
        }
      ],
      render: renderRetail
    },
    sales: {
      label: "Revenue operations",
      repo: "L2Q",
      endpoint: "https://ca-l2q-dev.wonderfulhill-26d0f535.uksouth.azurecontainerapps.io/mcp",
      description: "Turn a Salesforce estate into a morning operating brief for a complex, regulated sales portfolio.",
      explainer: "The browser performs an MCP initialise handshake, calls only the fixed read-only tool, reads its ui:// resource, injects tool output into a sandboxed Apps SDK host, and closes stateful sessions.",
      flow: ["Salesforce", "Pipeline", "Risk", "Manager brief"],
      calls: [{
        name: "get_sales_dashboard",
        arguments: {},
        widgetLabel: "Sales dashboard",
        widgetUri: "ui://widgets/dashboard.html"
      }],
      fallback: [
        {
          structuredContent: {
            pipeline: {
              total_value: 28910000,
              weighted_value: 15273000,
              total_opportunities: 75,
              avg_deal_size: 385466.67,
              by_stage: {
                "Id. Decision Makers": { count: 13, value: 5090000 },
                "Value Proposition": { count: 9, value: 4140000 },
                "Needs Analysis": { count: 7, value: 2010000 },
                "Negotiation/Review": { count: 11, value: 4310000 },
                "Proposal/Price Quote": { count: 3, value: 1570000 },
                Qualification: { count: 13, value: 4410000 },
                Prospecting: { count: 10, value: 3300000 }
              }
            },
            tasks: { total: 15, high_priority: 2, overdue: 15 },
            recent_leads: new Array(8).fill({})
          }
        }
      ],
      render: renderSales
    },
    procurement: {
      label: "Procurement operations",
      repo: "ess-mcp",
      endpoint: "https://essmcp-coupa.wittysand-460bf1d9.eastus.azurecontainerapps.io/coupa/mcp",
      displayHost: "essmcp-coupa.[redacted].eastus.azurecontainerapps.io",
      description: "Trace employee IT demand into Coupa, surfacing delivery and supply risk before it becomes an employee issue.",
      explainer: "The browser performs an MCP initialise handshake, calls only the fixed read-only tool, reads its ui:// resource, injects tool output into a sandboxed Apps SDK host, and closes stateful sessions.",
      flow: ["Employee demand", "Coupa", "Supply risk", "Category action"],
      calls: [{
        name: "get_category_manager_dashboard",
        arguments: {},
        widgetLabel: "Category manager dashboard",
        widgetUri: "ui://widget/coupa-category-dashboard.html"
      }],
      fallback: [
        {
          structuredContent: {
            as_of: "2026-05-06",
            category: "All IT hardware",
            summary: {
              order_count: 7,
              total_value: "227,464.00",
              open_value: "173,042.00",
              at_risk_orders: 2,
              by_category: {
                "Laptop hardware": 2,
                "Mobile devices": 2,
                "Developer workstations": 1,
                "Office equipment": 1,
                Accessories: 1
              }
            },
            alerts: [
              { severity: "high", title: "One order is past expected delivery", detail: "Escalate the late mobile-device order with the supplier." },
              { severity: "high", title: "Two items have less than one month of cover", detail: "Prioritise phones and USB-C docking stations." }
            ]
          }
        }
      ],
      render: renderProcurement
    }
  });

  class McpClient {
    constructor(endpoint) {
      this.endpoint = endpoint;
      this.sessionId = null;
      this.serverInfo = null;
      this.nextId = 1;
    }

    async connect() {
      const result = await this.request("initialize", {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {},
        clientInfo: { name: "scott-adams-ai", version: "1.0.0" }
      });
      this.serverInfo = result?.serverInfo || null;

      if (this.sessionId) {
        await this.notify("notifications/initialized", {});
      }

      return result;
    }

    async callTool(name, args) {
      return this.request("tools/call", { name, arguments: args });
    }

    async readResource(uri) {
      if (typeof uri !== "string" || !uri.startsWith("ui://")) {
        throw new Error("The tool did not declare a valid ui:// widget resource.");
      }

      const result = await this.request("resources/read", { uri });
      const resource = result?.contents?.find((content) => typeof content?.text === "string");
      const mimeType = resource?.mimeType || "";

      if (!resource || !mimeType.toLowerCase().includes("html")) {
        throw new Error(`The MCP resource ${uri} did not return an HTML document.`);
      }
      if (resource.text.length > 1500000) {
        throw new Error(`The MCP resource ${uri} exceeds the 1.5 MB preview limit.`);
      }

      return {
        uri,
        mimeType,
        html: resource.text
      };
    }

    async request(method, params) {
      const id = this.nextId++;
      const message = { jsonrpc: "2.0", id, method, params };
      const response = await this.post(message);
      const rpc = parseRpcResponse(response.body, response.contentType, id);

      if (rpc?.error) {
        throw new Error(rpc.error.message || `MCP request failed: ${method}`);
      }

      return rpc?.result;
    }

    async notify(method, params) {
      await this.post({ jsonrpc: "2.0", method, params });
    }

    async post(message) {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      const headers = {
        Accept: "application/json, text/event-stream",
        "Content-Type": "application/json",
        "MCP-Protocol-Version": PROTOCOL_VERSION
      };

      if (this.sessionId) {
        headers["Mcp-Session-Id"] = this.sessionId;
      }

      try {
        const response = await fetch(this.endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify(message),
          signal: controller.signal,
          mode: "cors",
          credentials: "omit",
          referrerPolicy: "strict-origin-when-cross-origin"
        });

        const returnedSession = response.headers.get("Mcp-Session-Id");
        if (returnedSession) {
          this.sessionId = returnedSession;
        }

        const body = await response.text();
        if (!response.ok) {
          throw new Error(`Endpoint returned HTTP ${response.status}`);
        }

        return {
          body,
          contentType: response.headers.get("Content-Type") || ""
        };
      } catch (error) {
        if (error.name === "AbortError") {
          throw new Error("The endpoint did not respond before the 45 second timeout.");
        }
        throw error;
      } finally {
        window.clearTimeout(timeout);
      }
    }

    async close() {
      if (!this.sessionId) return;

      try {
        const cleanup = fetch(this.endpoint, {
          method: "DELETE",
          headers: {
            Accept: "application/json, text/event-stream",
            "MCP-Protocol-Version": PROTOCOL_VERSION,
            "Mcp-Session-Id": this.sessionId
          },
          mode: "cors",
          credentials: "omit",
          referrerPolicy: "strict-origin-when-cross-origin"
        });
        await Promise.race([
          cleanup.catch(() => undefined),
          new Promise((resolve) => window.setTimeout(resolve, 1500))
        ]);
      } catch {
        // Session cleanup is best-effort; the server also expires idle sessions.
      }
    }
  }

  const scenarioButtons = Array.from(document.querySelectorAll("[data-scenario]"));
  const runButton = document.getElementById("run-scenario");
  const output = document.getElementById("lab-output");
  const status = document.getElementById("lab-status");
  const statusText = document.getElementById("lab-status-text");
  const callList = document.getElementById("lab-call-list");
  const callExplainer = document.getElementById("lab-call-explainer");
  const endpointLabel = document.getElementById("lab-endpoint");
  let activeScenario = "autonomous";
  let running = false;

  const filterButtons = Array.from(document.querySelectorAll("[data-widget-filter]"));
  const widgetTiles = Array.from(document.querySelectorAll("[data-widget-category]"));
  const widgetDialog = document.getElementById("widget-dialog");
  const widgetDialogTitle = document.getElementById("widget-dialog-title");
  const widgetDialogImage = document.getElementById("widget-dialog-image");
  const widgetDialogDescription = document.getElementById("widget-dialog-description");
  const widgetDialogClose = document.getElementById("widget-dialog-close");
  const widgetFrameHosts = new Set();

  function parseRpcResponse(body, contentType, requestId) {
    if (!body.trim()) return null;

    if (contentType.includes("text/event-stream") || body.trimStart().startsWith("event:")) {
      const messages = [];
      const events = body.split(/\r?\n\r?\n/);
      for (const event of events) {
        const data = event
          .split(/\r?\n/)
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trim())
          .join("\n");
        if (!data) continue;
        try {
          messages.push(JSON.parse(data));
        } catch {
          // Ignore keep-alive or non-JSON SSE events.
        }
      }
      return messages.find((message) => message.id === requestId) || messages.at(-1) || null;
    }

    return JSON.parse(body);
  }

  function findWidgetUri(result) {
    return result?._meta?.["openai/outputTemplate"]
      || result?._meta?.ui?.resourceUri
      || result?.structuredContent?._meta?.["openai/outputTemplate"]
      || result?.structuredContent?._meta?.ui?.resourceUri
      || null;
  }

  function selectScenario(key) {
    if (!SCENARIOS[key] || running) return;
    activeScenario = key;
    const scenario = SCENARIOS[key];

    for (const button of scenarioButtons) {
      const selected = button.dataset.scenario === key;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    }

    runButton.dataset.scenario = key;
    runButton.textContent = scenario.runLabel || `Run ${scenario.label.toLowerCase()} scenario`;
    endpointLabel.textContent = scenario.mode === "simulation"
      ? "local · redacted · side-effect free"
      : (scenario.displayHost || new URL(scenario.endpoint).hostname);
    callList.textContent = scenario.callSummary || scenario.calls.map((call) => call.name).join(" → ");
    if (callExplainer) callExplainer.textContent = scenario.explainer || "";
    setStatus("ready", scenario.mode === "simulation" ? "Ready to replay a business event" : "Ready to connect");
    renderPlaceholder(scenario);
  }

  function renderPlaceholder(scenario) {
    resetWidgetHosts();
    const wrapper = element("div", "lab-placeholder");
    wrapper.append(
      element("p", "result-kicker", `${scenario.repo} · guided scenario`),
      element("h3", "placeholder-title", scenario.description)
    );

    const flow = element("div", "flow-preview");
    scenario.flow.forEach((step, index) => {
      flow.append(element("span", "flow-node", step));
      if (index < scenario.flow.length - 1) {
        flow.append(element("span", "flow-arrow", "→"));
      }
    });
    wrapper.append(flow);

    const note = element("p", "placeholder-note", scenario.mode === "simulation"
      ? "This source-aligned replay uses synthetic names, deterministic repository rules and no external or API calls. The production manager, sponsor and governance dashboards remain authenticated operational surfaces."
      : "The browser will initialise an MCP session, invoke only the fixed read-only tools, read their ui:// resources, then render the actual Apps SDK widgets beside the operating brief.");
    wrapper.append(note);
    output.replaceChildren(wrapper);
  }

  async function runScenario() {
    if (running) return;
    running = true;
    const scenario = SCENARIOS[activeScenario];

    if (scenario.mode === "simulation") {
      setBusy(true);
      setStatus("connecting", "Business event received · autonomous run starting…");
      await scenario.render();
      setStatus("preview", "Safe replay complete · no external calls or side effects");
      setBusy(false);
      running = false;
      return;
    }

    const started = performance.now();
    let client;
    let live = false;
    let results = [];
    let widgets = [];
    let serverName = scenario.repo;
    let failureMessage = "";

    setBusy(true);
    setStatus("connecting", "Initialising MCP session…");

    try {
      client = new McpClient(scenario.endpoint);
      const init = await client.connect();
      serverName = init?.serverInfo?.name || scenario.repo;

      for (let index = 0; index < scenario.calls.length; index += 1) {
        const call = scenario.calls[index];
        setStatus("connecting", `Calling ${call.name} (${index + 1}/${scenario.calls.length})…`);
        const result = await client.callTool(call.name, call.arguments);
        if (result?.isError) {
          throw new Error(result.content?.[0]?.text || `${call.name} returned an error.`);
        }
        results.push(result);

        const widgetUri = findWidgetUri(result) || call.widgetUri;
        if (widgetUri) {
          setStatus("connecting", `Reading ${call.widgetLabel || call.name} resource…`);
          try {
            const resource = await client.readResource(widgetUri);
            widgets.push({
              ...resource,
              label: call.widgetLabel || call.name,
              toolName: call.name,
              toolResult: result,
              endpoint: scenario.endpoint
            });
          } catch (resourceError) {
            widgets.push({
              uri: widgetUri,
              label: call.widgetLabel || call.name,
              toolName: call.name,
              error: resourceError.message || "The widget resource could not be loaded."
            });
          }
        }
      }
      live = true;
    } catch (error) {
      failureMessage = error.message || "The live endpoint could not be reached.";
      results = scenario.fallback;
    } finally {
      await client?.close();
    }

    const latency = Math.max(1, Math.round(performance.now() - started));
    scenario.render(results, {
      live,
      latency,
      serverName,
      failureMessage,
      callCount: scenario.calls.length,
      widgets
    });

    if (live) {
      setStatus("live", `Live response · ${latency.toLocaleString()} ms`);
    } else {
      setStatus("preview", "Preview response · live endpoint unavailable from this origin");
    }
    setBusy(false);
    running = false;
  }

  async function renderAutonomous() {
    resetWidgetHosts();
    const scenario = {
      event: "Adoption gap crossed the intervention threshold",
      source: "Product usage event",
      account: "Northstar Financial",
      tier: "Strategic",
      influence: "High",
      sentiment: "Frustrated",
      severity: "Critical",
      feature: "Automated reconciliation",
      actingIdentity: "Northstar CSM Autopilot",
      manager: "Human CSM · EMEA",
      decision: "guided_recovery_outreach",
      channel: "csm_review",
      reviewReasons: ["RR-01 · high influence / frustrated", "RR-03 · strategic account", "RR-05 · complex topic"],
      outcome: "Draft prepared and routed for human judgement",
      delivery: "No customer message sent",
      controls: ["Agent 365 identity", "Microsoft Purview DSPM", "Cross-customer data fence", "OpenTelemetry evidence"]
    };
    const stages = [
      { key: "signal", label: "Signal detected", summary: `${scenario.severity} adoption gap on ${scenario.feature}.`, tool: "detect_signals" },
      { key: "context", label: "Context built", summary: `${scenario.tier} account · ${scenario.influence} influence · ${scenario.sentiment} sentiment.`, tool: "get_account_context + Work IQ" },
      { key: "action", label: "Next best action", summary: `${scenario.decision} · ${scenario.reviewReasons.length} rules require human judgement.`, tool: "decide_next_best_action" },
      { key: "content", label: "Content built", summary: "Approved recovery playbook drafted in the CSM's voice and screened for data leakage.", tool: "build_draft + Purview" },
      { key: "review", label: "Prioritised & reviewed", summary: "High-priority item routed to the assigned CSM's review queue.", tool: "create_review_task" },
      { key: "delivery", label: "Delivery gated", summary: scenario.delivery, tool: "delivery guardrail" },
      { key: "learning", label: "System learns", summary: "Outcome and decision recorded; working memory receives a redacted lesson.", tool: "write_outcome + remember" }
    ];

    const root = element("div", "result-view autonomous-result");
    const header = element("div", "result-header autonomous-result-header");
    header.append(
      element("span", "result-badge is-preview", "Source-aligned safe replay"),
      element("p", "result-kicker", "Event-triggered business process"),
      element("h3", "result-heading", "A customer signal lands. The agent starts work."),
      element("p", "result-summary", "No chat prompt starts this journey. The event resolves a governed agent identity, runs the same seven stages as the repository engine and stops at the human-judgement boundary.")
    );
    const protocol = element("div", "protocol-line");
    ["synthetic data", "0 external calls", "0 writes", "0 messages sent", "deterministic rules"].forEach((item) => {
      protocol.append(element("span", "protocol-item", item));
    });
    header.append(protocol);
    root.append(header);

    const eventCard = element("section", "autonomous-event-card");
    const eventCopy = element("div", "autonomous-event-copy");
    eventCopy.append(
      element("span", "autonomous-event-pulse", "Event received"),
      element("h4", "autonomous-event-title", scenario.event),
      element("p", "autonomous-event-meta", `${scenario.source} · ${scenario.account} · ${scenario.feature}`)
    );
    const identity = element("div", "autonomous-identity");
    identity.append(
      element("span", "autonomous-identity-label", "Acting identity"),
      element("strong", "autonomous-identity-name", scenario.actingIdentity),
      element("small", "autonomous-identity-detail", "Entra Agent ID · autonomous token · scoped to assigned book")
    );
    eventCard.append(eventCopy, identity);
    root.append(eventCard);

    const timelineSection = element("section", "autonomous-timeline-section");
    timelineSection.append(element("h4", "result-section-title", "Seven-stage autonomous journey"));
    const timeline = element("ol", "autonomous-timeline");
    stages.forEach((stage, index) => {
      const item = element("li", "autonomous-stage");
      item.dataset.stage = stage.key;
      const marker = element("span", "autonomous-stage-marker", String(index + 1).padStart(2, "0"));
      const copy = element("div", "autonomous-stage-copy");
      copy.append(
        element("strong", "autonomous-stage-title", stage.label),
        element("p", "autonomous-stage-summary", "Waiting…"),
        element("span", "autonomous-stage-tool", stage.tool)
      );
      item.append(marker, copy);
      timeline.append(item);
    });
    timelineSection.append(timeline);
    root.append(timelineSection);

    const decision = element("section", "autonomous-decision");
    const decisionHead = element("div", "autonomous-decision-head");
    decisionHead.append(
      element("span", "autonomous-decision-kicker", "Deterministic route"),
      element("strong", "autonomous-decision-state", "Human judgement required")
    );
    const decisionBody = element("div", "autonomous-decision-body");
    const ruleList = element("div", "autonomous-rule-list");
    scenario.reviewReasons.forEach((reason) => ruleList.append(element("span", "autonomous-rule", reason)));
    const fork = element("div", "autonomous-fork");
    const autoBranch = element("div", "autonomous-branch is-muted");
    autoBranch.append(
      element("span", "autonomous-branch-label", "Auto-deliver"),
      element("strong", "autonomous-branch-state", "Blocked by rules"),
      element("small", "autonomous-branch-detail", "No email or in-product message")
    );
    const reviewBranch = element("div", "autonomous-branch is-selected");
    reviewBranch.append(
      element("span", "autonomous-branch-label", "Manager review"),
      element("strong", "autonomous-branch-state", "Selected route"),
      element("small", "autonomous-branch-detail", "Draft visible only to assigned CSM")
    );
    fork.append(autoBranch, reviewBranch);
    decisionBody.append(ruleList, fork);
    decision.append(decisionHead, decisionBody);
    root.append(decision);

    const tabsSection = element("section", "autonomous-supervision");
    const tabsHead = element("div", "autonomous-supervision-head");
    tabsHead.append(
      element("div", "autonomous-supervision-title", "Supervision after autonomy"),
      element("span", "mcp-resource-badge", "redacted portfolio view")
    );
    const tabs = element("div", "autonomous-tabs");
    tabs.setAttribute("role", "tablist");
    const panel = element("div", "autonomous-panel");
    const views = [
      {
        id: "manager",
        label: "Manager cockpit",
        render: () => managerPreview(scenario)
      },
      {
        id: "sponsor",
        label: "Sponsor fleet",
        render: sponsorPreview
      },
      {
        id: "governance",
        label: "Governance evidence",
        render: () => governancePreview(scenario)
      }
    ];
    const selectView = (index) => {
      tabs.querySelectorAll("button").forEach((button, buttonIndex) => {
        const selected = buttonIndex === index;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-selected", String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
      panel.replaceChildren(views[index].render());
    };
    views.forEach((view, index) => {
      const button = element("button", "autonomous-tab", view.label);
      button.type = "button";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(index === 0));
      button.tabIndex = index === 0 ? 0 : -1;
      button.addEventListener("click", () => selectView(index));
      tabs.append(button);
    });
    tabs.addEventListener("keydown", (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const buttons = Array.from(tabs.querySelectorAll("button"));
      const current = Math.max(0, buttons.indexOf(document.activeElement));
      const next = (current + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus();
      selectView(next);
    });
    tabsSection.append(tabsHead, tabs, panel);
    root.append(tabsSection);

    const safety = element("p", "autonomous-safety-note", "Why this is a replay: the production control plane contains manager, customer and identity-scoped operational data. This portfolio never embeds it, sends credentials to it, or exposes its mutation routes.");
    root.append(safety);
    output.replaceChildren(root);

    const stageNodes = Array.from(timeline.querySelectorAll(".autonomous-stage"));
    for (let index = 0; index < stageNodes.length; index += 1) {
      const node = stageNodes[index];
      const stage = stages[index];
      node.classList.add("is-running");
      node.querySelector(".autonomous-stage-summary").textContent = "Running…";
      await delay(prefersReducedMotion() ? 20 : 430);
      node.classList.remove("is-running");
      node.classList.add("is-done");
      node.querySelector(".autonomous-stage-summary").textContent = stage.summary;
    }
    decision.classList.add("is-revealed");
    selectView(0);
  }

  function managerPreview(scenario) {
    const view = element("div", "supervision-view manager-preview");
    const top = element("div", "supervision-view-head");
    top.append(
      element("div", "supervision-avatar", "HC"),
      element("div", "supervision-head-copy")
    );
    top.lastChild.append(
      element("strong", "supervision-view-title", "My CSM Autopilot"),
      element("span", "supervision-view-subtitle", "Assigned portfolio · identity-scoped")
    );
    top.append(element("span", "supervision-state needs-review", "Needs review"));
    view.append(top, supervisionMetrics([
      ["1", "Review item"],
      ["Critical", "Signal severity"],
      ["7/7", "Stages complete"],
      ["0", "Messages sent"]
    ]));
    const review = element("div", "review-preview");
    review.append(
      element("span", "review-preview-priority", "High priority"),
      element("strong", "review-preview-title", `${scenario.account} · ${scenario.decision.replaceAll("_", " ")}`),
      element("p", "review-preview-copy", "The agent prepared a governed draft from approved recovery content. The assigned CSM can inspect context, edit the language, accept, save a draft or discard."),
      element("span", "review-preview-lock", "Actions disabled in public portfolio")
    );
    view.append(review);
    return view;
  }

  function sponsorPreview() {
    const view = element("div", "supervision-view sponsor-preview");
    const top = element("div", "supervision-view-head");
    top.append(
      element("div", "supervision-avatar sponsor-avatar", "PO"),
      element("div", "supervision-head-copy")
    );
    top.lastChild.append(
      element("strong", "supervision-view-title", "Programme control"),
      element("span", "supervision-view-subtitle", "Aggregate fleet posture · sponsor-only")
    );
    top.append(element("span", "supervision-state", "Fleet healthy"));
    view.append(top, supervisionMetrics([
      ["3", "Autopilots"],
      ["195", "Synthetic accounts"],
      ["1", "HITL queue"],
      ["1", "Journey observed"]
    ]));
    const fleet = element("div", "fleet-preview");
    [
      ["Autopilot A", "Running", "1 review", 86],
      ["Autopilot B", "Idle", "0 review", 68],
      ["Autopilot C", "Idle", "0 review", 54]
    ].forEach(([name, state, queue, value]) => {
      const row = element("div", "fleet-preview-row");
      row.append(element("strong", "fleet-name", name), element("span", "fleet-state", state));
      const track = element("span", "fleet-track");
      const fill = element("i", "fleet-fill");
      fill.style.width = `${value}%`;
      track.append(fill);
      row.append(track, element("span", "fleet-queue", queue));
      fleet.append(row);
    });
    view.append(fleet);
    return view;
  }

  function governancePreview(scenario) {
    const view = element("div", "supervision-view governance-preview");
    const top = element("div", "supervision-view-head");
    top.append(
      element("div", "supervision-avatar governance-avatar", "ID"),
      element("div", "supervision-head-copy")
    );
    top.lastChild.append(
      element("strong", "supervision-view-title", scenario.actingIdentity),
      element("span", "supervision-view-subtitle", "Agent 365 identity · governed access · observable work")
    );
    top.append(element("span", "supervision-state", "Policy allowed"));
    view.append(top);
    const evidence = element("div", "governance-evidence-grid");
    scenario.controls.forEach((control, index) => {
      const card = element("div", "governance-evidence-card");
      card.append(
        element("span", "governance-check", "✓"),
        element("strong", "governance-control", control),
        element("small", "governance-detail", [
          "Autonomous work resolves a named agent identity before tools run.",
          "Prompt, response, grounding and tool activity can be evaluated and audited.",
          "Drafts are screened so one customer's identifiers cannot cross into another's outreach.",
          "Stages, tools, tokens, cost, decisions and outcomes form a forensic job record."
        ][index])
      );
      evidence.append(card);
    });
    view.append(evidence);
    return view;
  }

  function supervisionMetrics(metrics) {
    const grid = element("div", "supervision-metrics");
    metrics.forEach(([value, label]) => {
      const metric = element("div", "supervision-metric");
      metric.append(element("strong", "supervision-metric-value", value), element("span", "supervision-metric-label", label));
      grid.append(metric);
    });
    return grid;
  }

  function delay(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function renderRetail(results, meta) {
    const weather = results[0]?.structuredContent?.data?.weather || {};
    const storeName = results[0]?.structuredContent?.data?.store_name || "Guildford High Street";
    const travel = results[1]?.structuredContent?.data?.travel || {};
    const stockData = results[2]?.structuredContent?.data || {};
    const current = weather.current || {};
    const today = weather.forecast_3day?.[0] || {};
    const event = weather.local_events?.[0] || {};
    const criticalItems = (stockData.items || []).filter((item) => String(item.status).toLowerCase() === "critical");

    const root = resultRoot(
      meta,
      "Frontline operations",
      `Opening shift brief · ${storeName}`,
      "Three operational systems become one decision surface for the shift manager."
    );

    root.append(metricGrid([
      { value: `${current.temp_c ?? "—"}°C`, label: current.condition || "Current weather" },
      { value: today.footfall_impact || "—", label: "Expected morning footfall" },
      { value: travel.overall_impact || "—", label: "Travel impact" },
      { value: String(stockData.critical_count ?? criticalItems.length), label: "Critical stock lines" }
    ]));

    const signals = element("div", "signal-grid");
    signals.append(
      signalCard("Demand signal", today.impact_label || "Weather and local events shape expected demand."),
      signalCard("Workforce signal", travel.impact_summary || "Travel disruption is mapped to the people and shift it affects."),
      signalCard(
        "Supply signal",
        criticalItems.length
          ? criticalItems.slice(0, 3).map((item) => item.name).join(" · ")
          : "No critical stock items returned."
      )
    );
    root.append(signals);

    const actions = [
      ...(travel.recommended_actions || []).slice(0, 2),
      criticalItems.length
        ? `Replenish ${criticalItems.slice(0, 2).map((item) => item.name).join(" and ")} before the demand peak.`
        : "Keep the stock plan aligned to expected footfall.",
      event.event ? `Prepare for ${event.event} (${event.footfall_impact || "elevated footfall"}).` : null
    ].filter(Boolean);
    root.append(actionSection("Manager actions surfaced", actions));
    output.replaceChildren(root);
  }

  function renderSales(results, meta) {
    const data = results[0]?.structuredContent || {};
    const pipeline = data.pipeline || {};
    const tasks = data.tasks || {};
    const stages = Object.entries(pipeline.by_stage || {}).map(([name, value]) => ({
      name,
      count: value.count || 0,
      value: value.value || 0
    }));

    const root = resultRoot(
      meta,
      "Revenue operations",
      "Portfolio operating brief",
      "CRM records become a prioritised view of pipeline shape, execution load and management attention."
    );

    root.append(metricGrid([
      { value: compactCurrency(pipeline.total_value), label: "Open pipeline" },
      { value: compactCurrency(pipeline.weighted_value), label: "Weighted pipeline" },
      { value: String(pipeline.total_opportunities ?? "—"), label: "Open opportunities" },
      { value: String(tasks.overdue ?? "—"), label: "Overdue actions" }
    ]));

    if (stages.length) {
      root.append(barSection("Pipeline by stage", stages, (item) => `${item.count} · ${compactCurrency(item.value)}`));
    }

    const negotiation = stages.find((stage) => stage.name.toLowerCase().includes("negotiation"));
    root.append(actionSection("Management questions this creates", [
      negotiation ? `${negotiation.count} opportunities are in negotiation/review — which need executive intervention?` : "Which late-stage deals need executive intervention?",
      `${tasks.high_priority ?? 0} high-priority tasks and ${tasks.overdue ?? 0} overdue actions need owner-level accountability.`,
      "Where should account context, compliance signals and communication evidence change forecast confidence?"
    ]));
    output.replaceChildren(root);
  }

  function renderProcurement(results, meta) {
    const data = results[0]?.structuredContent || {};
    const summary = data.summary || {};
    const categories = Object.entries(summary.by_category || {}).map(([name, count]) => ({ name, count, value: count }));

    const root = resultRoot(
      meta,
      "Procurement operations",
      "IT category risk brief",
      "Service requests, purchase orders, receipts and supplier signals become one intervention queue."
    );

    root.append(metricGrid([
      { value: String(summary.order_count ?? "—"), label: "Tracked orders" },
      { value: `£${summary.total_value || "—"}`, label: "Total value" },
      { value: `£${summary.open_value || "—"}`, label: "Open value" },
      { value: String(summary.at_risk_orders ?? "—"), label: "Orders at risk" }
    ]));

    if (categories.length) {
      root.append(barSection("Orders by category", categories, (item) => `${item.count} ${item.count === 1 ? "order" : "orders"}`));
    }

    const alerts = element("div", "result-section");
    alerts.append(element("h4", "result-section-title", "Intervention queue"));
    const list = element("div", "alert-list");
    (data.alerts || []).slice(0, 4).forEach((alert) => {
      const item = element("div", `alert-item severity-${normaliseClass(alert.severity || "medium")}`);
      item.append(
        element("strong", "alert-title", alert.title || "Procurement alert"),
        element("p", "alert-copy", alert.detail || "Review this item with the category owner.")
      );
      list.append(item);
    });
    if (!list.childElementCount) {
      list.append(element("p", "result-muted", "No active alerts were returned."));
    }
    alerts.append(list);
    root.append(alerts);
    output.replaceChildren(root);
  }

  function resultRoot(meta, kicker, heading, summary) {
    resetWidgetHosts();
    const root = element("div", "result-view");
    const header = element("div", "result-header");
    const badge = element("span", meta.live ? "result-badge is-live" : "result-badge is-preview", meta.live ? "Live MCP response" : "Preview response");
    header.append(
      badge,
      element("p", "result-kicker", kicker),
      element("h3", "result-heading", heading),
      element("p", "result-summary", summary)
    );

    const protocol = element("div", "protocol-line");
    protocol.append(
      element("span", "protocol-item", `${meta.callCount} read-only tool call${meta.callCount === 1 ? "" : "s"}`),
      element("span", "protocol-item", `${meta.widgets?.filter((widget) => widget.html).length || 0} Apps SDK resource${meta.widgets?.filter((widget) => widget.html).length === 1 ? "" : "s"}`),
      element("span", "protocol-item", `MCP ${PROTOCOL_VERSION}`),
      element("span", "protocol-item", `${meta.latency.toLocaleString()} ms`),
      element("span", "protocol-item", meta.serverName)
    );
    header.append(protocol);

    if (!meta.live && meta.failureMessage) {
      header.append(element("p", "preview-reason", `Local preview used: ${meta.failureMessage}`));
    }

    root.append(header);
    if (meta.widgets?.length) {
      root.append(widgetResourceSection(meta.widgets));
    }
    return root;
  }

  function widgetResourceSection(widgets) {
    const section = element("section", "mcp-widget-preview");
    const heading = element("div", "mcp-widget-heading");
    const headingCopy = element("div", "mcp-widget-heading-copy");
    headingCopy.append(
      element("p", "result-kicker", "Tool-delivered interface"),
      element("h4", "mcp-widget-title", "Actual OpenAI Apps SDK widget")
    );
    heading.append(
      headingCopy,
      element("span", "mcp-resource-badge", "resources/read · sandboxed")
    );
    section.append(heading);

    let tabs = null;
    if (widgets.length > 1) {
      tabs = element("div", "mcp-widget-tabs");
      tabs.setAttribute("role", "tablist");
      tabs.setAttribute("aria-label", "Tool-delivered widget resources");
      widgets.forEach((widget, index) => {
        const button = element("button", "mcp-widget-tab", widget.label);
        button.type = "button";
        button.dataset.widgetIndex = String(index);
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", String(index === 0));
        button.tabIndex = index === 0 ? 0 : -1;
        tabs.append(button);
      });
      section.append(tabs);
    }

    const stage = element("div", "mcp-widget-stage");
    stage.setAttribute("role", "tabpanel");
    const action = element("div", "mcp-widget-action");
    action.hidden = true;
    const note = element(
      "p",
      "mcp-widget-note",
      "This is the HTML resource served by the MCP tool. Widget follow-up actions are shown here as previews; they never invoke write tools."
    );
    section.append(stage, action, note);

    const selectWidget = (index) => {
      const widget = widgets[index];
      removeWidgetHostsForPanel(section);
      stage.replaceChildren();
      action.hidden = true;

      tabs?.querySelectorAll(".mcp-widget-tab").forEach((button, buttonIndex) => {
        const selected = buttonIndex === index;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-selected", String(selected));
        button.tabIndex = selected ? 0 : -1;
      });

      if (!widget?.html) {
        const error = element("div", "mcp-widget-error");
        error.append(
          element("strong", "mcp-widget-error-title", `${widget?.label || "Widget"} resource unavailable`),
          element("p", "mcp-widget-error-copy", widget?.error || "The endpoint did not return an HTML resource.")
        );
        stage.append(error);
        return;
      }

      renderWidgetFrame(widget, section, stage, action);
    };

    tabs?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-widget-index]");
      if (!button) return;
      selectWidget(Number(button.dataset.widgetIndex));
    });
    tabs?.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const buttons = Array.from(tabs.querySelectorAll(".mcp-widget-tab"));
      const current = buttons.indexOf(document.activeElement);
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = (current + direction + buttons.length) % buttons.length;
      buttons[next].focus();
      selectWidget(next);
    });

    selectWidget(0);
    return section;
  }

  function renderWidgetFrame(widget, panel, stage, action) {
    const toolbar = element("div", "mcp-widget-toolbar");
    const identity = element("div", "mcp-widget-identity");
    identity.append(
      element("strong", "mcp-widget-label", widget.label),
      element("span", "mcp-widget-uri", widget.uri)
    );
    const expandButton = element("button", "mcp-widget-expand", "Expand");
    expandButton.type = "button";
    toolbar.append(identity, expandButton);

    const frame = document.createElement("iframe");
    frame.className = "mcp-widget-frame";
    frame.title = `${widget.label} OpenAI Apps SDK widget`;
    frame.setAttribute("sandbox", "allow-scripts");
    frame.setAttribute("referrerpolicy", "no-referrer");
    frame.setAttribute("loading", "eager");

    stage.append(toolbar, frame);

    const channel = `mcp-widget-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const host = {
      action,
      channel,
      expandButton,
      expanded: false,
      frame,
      intrinsicHeight: 560,
      panel
    };
    widgetFrameHosts.add(host);
    expandButton.addEventListener("click", () => setWidgetExpanded(host, !host.expanded));
    frame.srcdoc = buildWidgetDocument(widget, channel);
  }

  function buildWidgetDocument(widget, channel) {
    const endpointOrigin = new URL(widget.endpoint).origin;
    const theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const toolOutput = widget.toolResult?.structuredContent ?? widget.toolResult ?? {};
    const toolResponseMetadata = widget.toolResult?._meta
      ?? widget.toolResult?.structuredContent?._meta
      ?? {};
    const payload = safeJsonForScript({
      channel,
      locale: navigator.language || "en-GB",
      theme,
      toolOutput,
      toolResponseMetadata
    });
    const contentSecurityPolicy = [
      "default-src 'none'",
      "base-uri 'none'",
      `img-src data: blob: ${endpointOrigin}`,
      `media-src data: blob: ${endpointOrigin}`,
      `font-src data: ${endpointOrigin}`,
      `style-src 'unsafe-inline' ${endpointOrigin}`,
      "script-src 'unsafe-inline'",
      "connect-src 'none'",
      "form-action 'none'"
    ].join("; ");
    const bridge = `
      <meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy}">
      <script>
        (() => {
          const payload = ${payload};
          let widgetState = null;
          const send = (type, detail = {}) => parent.postMessage({
            source: "scott-adams-mcp-widget",
            channel: payload.channel,
            type,
            ...detail
          }, "*");
          const requestMode = (request) => {
            const mode = typeof request === "string" ? request : request?.mode;
            openai.displayMode = mode === "fullscreen" || mode === "maximised" ? "fullscreen" : "inline";
            send("display-mode", { mode: openai.displayMode });
            return Promise.resolve({ mode: openai.displayMode });
          };
          const followUp = (message) => {
            const prompt = typeof message === "string" ? message : message?.prompt || message?.content || "";
            if (prompt) send("follow-up", { prompt: String(prompt).slice(0, 2000) });
            return Promise.resolve({ status: "previewed" });
          };
          const openai = {
            callTool() {
              return Promise.reject(new Error("Direct widget tool calls are disabled in this read-only preview."));
            },
            displayMode: "inline",
            locale: payload.locale,
            maxHeight: 720,
            notifyIntrinsicHeight(height) {
              const value = Number(height) || document.documentElement.scrollHeight;
              send("height", { height: value });
              return Promise.resolve({ height: value });
            },
            requestDisplayMode: requestMode,
            safeArea: { insets: { top: 0, right: 0, bottom: 0, left: 0 } },
            sendFollowUpMessage: followUp,
            setWidgetState(state) {
              widgetState = state;
              openai.widgetState = state;
              return Promise.resolve(state);
            },
            theme: payload.theme,
            toolOutput: payload.toolOutput,
            toolResponseMetadata: payload.toolResponseMetadata,
            userAgent: { device: { type: "desktop" }, capabilities: { hover: true, touch: false } },
            widgetState
          };
          openai.apps = {
            sendMessage(message) {
              return followUp({ prompt: message?.content || message?.prompt || "" });
            },
            setSize(mode) {
              return requestMode({ mode: mode === "maximised" ? "fullscreen" : "inline" });
            }
          };
          window.openai = openai;

          const publishGlobals = () => {
            const globals = {
              displayMode: openai.displayMode,
              locale: openai.locale,
              maxHeight: openai.maxHeight,
              safeArea: openai.safeArea,
              theme: openai.theme,
              toolOutput: openai.toolOutput,
              toolResponseMetadata: openai.toolResponseMetadata,
              userAgent: openai.userAgent,
              widgetState: openai.widgetState
            };
            window.dispatchEvent(new CustomEvent("openai:set_globals", { detail: { globals } }));
            window.postMessage({ type: "openai:set_globals", globals, structuredContent: openai.toolOutput }, "*");
            openai.notifyIntrinsicHeight(document.documentElement.scrollHeight);
          };
          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => setTimeout(publishGlobals, 0), { once: true });
          } else {
            setTimeout(publishGlobals, 0);
          }
          if (typeof ResizeObserver === "function") {
            addEventListener("DOMContentLoaded", () => {
              const observer = new ResizeObserver(() => openai.notifyIntrinsicHeight(document.documentElement.scrollHeight));
              observer.observe(document.documentElement);
            }, { once: true });
          }
        })();
      <\/script>
    `;

    if (/<head(?:\s[^>]*)?>/i.test(widget.html)) {
      return widget.html.replace(/<head(\s[^>]*)?>/i, (match) => `${match}${bridge}`);
    }
    return `<!doctype html><html><head>${bridge}</head><body>${widget.html}</body></html>`;
  }

  function safeJsonForScript(value) {
    return JSON.stringify(value)
      .replace(/&/g, "\\u0026")
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
  }

  function setWidgetExpanded(host, expanded) {
    widgetFrameHosts.forEach((candidate) => {
      if (candidate !== host && candidate.expanded) setWidgetExpanded(candidate, false);
    });
    host.expanded = expanded;
    host.panel.classList.toggle("is-expanded", expanded);
    host.expandButton.textContent = expanded ? "Restore" : "Expand";
    document.body.classList.toggle("has-expanded-widget", expanded);
    host.frame.style.height = expanded
      ? "calc(100vh - 190px)"
      : `${Math.max(480, Math.min(700, host.intrinsicHeight))}px`;
  }

  function removeWidgetHostsForPanel(panel) {
    widgetFrameHosts.forEach((host) => {
      if (host.panel !== panel) return;
      if (host.expanded) setWidgetExpanded(host, false);
      widgetFrameHosts.delete(host);
    });
  }

  function resetWidgetHosts() {
    widgetFrameHosts.forEach((host) => {
      host.panel.classList.remove("is-expanded");
    });
    widgetFrameHosts.clear();
    document.body.classList.remove("has-expanded-widget");
  }

  function handleWidgetMessage(event) {
    const host = Array.from(widgetFrameHosts).find((candidate) => candidate.frame.contentWindow === event.source);
    const message = event.data;
    if (!host || message?.source !== "scott-adams-mcp-widget" || message.channel !== host.channel) return;

    if (message.type === "height") {
      host.intrinsicHeight = Math.max(320, Number(message.height) || 560);
      if (!host.expanded) {
        host.frame.style.height = `${Math.max(480, Math.min(700, host.intrinsicHeight))}px`;
      }
      return;
    }

    if (message.type === "display-mode") {
      setWidgetExpanded(host, message.mode === "fullscreen");
      return;
    }

    if (message.type === "follow-up") {
      host.action.replaceChildren(
        element("span", "mcp-widget-action-label", "Widget follow-up preview"),
        element("p", "mcp-widget-action-prompt", message.prompt)
      );
      host.action.hidden = false;
    }
  }

  function metricGrid(metrics) {
    const grid = element("div", "metric-grid");
    metrics.forEach((metric) => {
      const item = element("div", "metric");
      item.append(
        element("strong", "metric-value", metric.value),
        element("span", "metric-label", metric.label)
      );
      grid.append(item);
    });
    return grid;
  }

  function signalCard(title, copy) {
    const card = element("div", "signal-card");
    card.append(
      element("span", "signal-title", title),
      element("p", "signal-copy", copy)
    );
    return card;
  }

  function actionSection(title, actions) {
    const section = element("div", "result-section");
    section.append(element("h4", "result-section-title", title));
    const list = element("ol", "action-list");
    actions.forEach((action) => list.append(element("li", "action-item", action)));
    section.append(list);
    return section;
  }

  function barSection(title, items, labelFormatter) {
    const section = element("div", "result-section");
    section.append(element("h4", "result-section-title", title));
    const list = element("div", "bar-list");
    const max = Math.max(...items.map((item) => Number(item.value) || 0), 1);

    items
      .slice()
      .sort((a, b) => Number(b.value) - Number(a.value))
      .slice(0, 8)
      .forEach((item) => {
        const row = element("div", "bar-row");
        const labels = element("div", "bar-labels");
        labels.append(
          element("span", "bar-name", item.name),
          element("span", "bar-value", labelFormatter(item))
        );
        const track = element("div", "bar-track");
        const fill = element("span", "bar-fill");
        fill.style.width = `${Math.max(4, Math.min(100, (Number(item.value) / max) * 100))}%`;
        track.append(fill);
        row.append(labels, track);
        list.append(row);
      });

    section.append(list);
    return section;
  }

  function compactCurrency(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "—";
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      notation: "compact",
      maximumFractionDigits: 1
    }).format(number);
  }

  function normaliseClass(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9-]/g, "-");
  }

  function filterWidgets(category) {
    filterButtons.forEach((button) => {
      const selected = button.dataset.widgetFilter === category;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    widgetTiles.forEach((tile) => {
      const visible = category === "all" || tile.dataset.widgetCategory === category;
      tile.classList.toggle("is-hidden", !visible);
      tile.setAttribute("aria-hidden", String(!visible));
      tile.tabIndex = visible ? 0 : -1;
    });
  }

  function openWidgetPreview(tile) {
    if (!widgetDialog || !widgetDialogTitle || !widgetDialogImage || !widgetDialogDescription) return;
    widgetDialogTitle.textContent = tile.dataset.widgetTitle || "Widget preview";
    widgetDialogImage.src = tile.dataset.widgetSrc || "";
    widgetDialogImage.alt = tile.querySelector("img")?.alt || "Widget preview";
    widgetDialogDescription.textContent = tile.dataset.widgetDescription || "";
    widgetDialog.showModal();
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function setBusy(isBusy) {
    output.setAttribute("aria-busy", String(isBusy));
    runButton.disabled = isBusy;
    runButton.classList.toggle("is-loading", isBusy);
    const scenario = SCENARIOS[activeScenario];
    runButton.textContent = isBusy
      ? (scenario.mode === "simulation" ? "Replaying autonomous journey…" : "Running live tools…")
      : (scenario.runLabel || `Run ${scenario.label.toLowerCase()} scenario`);
    scenarioButtons.forEach((button) => {
      button.disabled = isBusy;
    });
  }

  function setStatus(state, text) {
    status.dataset.state = state;
    statusText.textContent = text;
  }

  scenarioButtons.forEach((button) => {
    button.addEventListener("click", () => selectScenario(button.dataset.scenario));
    button.addEventListener("keydown", (event) => {
      if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
      event.preventDefault();
      const currentIndex = scenarioButtons.indexOf(button);
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const nextIndex = (currentIndex + direction + scenarioButtons.length) % scenarioButtons.length;
      scenarioButtons[nextIndex].focus();
      selectScenario(scenarioButtons[nextIndex].dataset.scenario);
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => filterWidgets(button.dataset.widgetFilter));
  });

  widgetTiles.forEach((tile) => {
    tile.addEventListener("click", () => openWidgetPreview(tile));
  });

  widgetDialogClose?.addEventListener("click", () => widgetDialog?.close());
  widgetDialog?.addEventListener("click", (event) => {
    if (event.target === widgetDialog) widgetDialog.close();
  });
  window.addEventListener("message", handleWidgetMessage);

  runButton?.addEventListener("click", runScenario);

  const requestedScenario = new URLSearchParams(window.location.search).get("scenario");
  selectScenario(SCENARIOS[requestedScenario] ? requestedScenario : "autonomous");
  filterWidgets("all");

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
