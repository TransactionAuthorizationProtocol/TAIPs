/* ================================================================
   TAP Mermaid theme — Notabene foundation + TAP cyan accents.
   Adapted from the notabene-branding skill (`ui_kits/docs/mermaid-theme.js`).

   Initialize *before* mermaid auto-runs, then manually parse each block
   so we don't race the default `startOnLoad` pipeline.
   ================================================================ */
(function () {
  const THEME = {
    darkGreen: '#002F0D',  /* TAP ink */
    green:     '#41E129',  /* settlement / success */
    greenBase: '#ECF8E8',  /* tap-wash */
    greenComp: '#C0EFCD',
    teal:      '#7FEDE5',  /* tap-accent-2 */
    cyan:      '#00C2B8',  /* tap-accent — TAP authorization signal */
    cyanSoft:  '#E6FBF9',
    beige:     '#FAF8F2',
    grey:      '#808080',
    border:    '#949494',
  };

  const cfg = {
    startOnLoad: false,
    theme: 'base',
    fontFamily: "'Roboto Slab', Georgia, serif",
    securityLevel: 'loose',
    themeVariables: {
      primaryColor:        '#FFFFFF',
      primaryTextColor:    THEME.darkGreen,
      primaryBorderColor:  THEME.darkGreen,
      secondaryColor:      THEME.greenBase,
      secondaryTextColor:  THEME.darkGreen,
      secondaryBorderColor: THEME.darkGreen,
      tertiaryColor:       THEME.beige,
      tertiaryTextColor:   THEME.darkGreen,
      tertiaryBorderColor: THEME.darkGreen,

      background:          THEME.beige,
      mainBkg:             '#FFFFFF',
      secondBkg:           THEME.greenBase,
      lineColor:           THEME.darkGreen,
      textColor:           THEME.darkGreen,

      /* Flowchart */
      nodeBorder:          THEME.darkGreen,
      clusterBkg:          THEME.beige,
      clusterBorder:       THEME.darkGreen,
      defaultLinkColor:    THEME.darkGreen,
      titleColor:          THEME.darkGreen,
      edgeLabelBackground: THEME.beige,
      nodeTextColor:       THEME.darkGreen,

      /* Sequence */
      actorBkg:            THEME.darkGreen,
      actorTextColor:      '#FFFFFF',
      actorBorder:         THEME.darkGreen,
      actorLineColor:      THEME.grey,
      signalColor:         THEME.darkGreen,
      signalTextColor:     THEME.darkGreen,
      labelBoxBkgColor:    '#FFFFFF',
      labelBoxBorderColor: THEME.darkGreen,
      labelTextColor:      THEME.darkGreen,
      loopTextColor:       THEME.darkGreen,
      noteBkgColor:        THEME.greenBase,
      noteBorderColor:     THEME.darkGreen,
      noteTextColor:       THEME.darkGreen,
      /* TAP twist: activation rectangles in cyan = authorization "in flight". */
      activationBkgColor:  THEME.cyanSoft,
      activationBorderColor: THEME.cyan,
      sequenceNumberColor: '#FFFFFF',

      /* State */
      specialStateColor:   THEME.green,
      innerEndBackground:  THEME.darkGreen,
      altBackground:       THEME.beige,

      errorBkgColor:       '#FFE8E8',
      errorTextColor:      '#8A1B1B',
    },
    flowchart: { curve: 'linear', nodeSpacing: 50, rankSpacing: 60, htmlLabels: true, useMaxWidth: true },
    sequence: { actorMargin: 80, messageMargin: 46, mirrorActors: false, showSequenceNumbers: false, useMaxWidth: true },
    state:    { nodeSpacing: 50, useMaxWidth: true },
  };

  function injectStyles() {
    if (document.getElementById('__tap_mermaid_styles')) return;
    const s = document.createElement('style');
    s.id = '__tap_mermaid_styles';
    s.textContent = `
      .mermaid svg { background: transparent; }

      /* --- Flowchart node shapes --- */
      .mermaid .node > rect, .mermaid .node > polygon, .mermaid .node > circle,
      .mermaid .node > ellipse, .mermaid .node > path {
        stroke-width: 1.5px !important;
        filter: drop-shadow(3px 3px 0 rgba(0,0,0,.12));
      }
      .mermaid .node:not(.solid):not(.lime):not(.soft):not(.cyan) > rect,
      .mermaid .node:not(.solid):not(.lime):not(.soft):not(.cyan) > polygon,
      .mermaid .node:not(.solid):not(.lime):not(.soft):not(.cyan) > path {
        fill: #FFFFFF !important; stroke: ${THEME.darkGreen} !important;
      }

      /* classDef variants — usable from inside a diagram via \`class X solid\` etc. */
      .mermaid .node.solid > rect, .mermaid .node.solid > polygon, .mermaid .node.solid > path, .mermaid .node.solid > ellipse {
        fill: ${THEME.darkGreen} !important; stroke: ${THEME.darkGreen} !important;
      }
      .mermaid .node.solid .nodeLabel, .mermaid .node.solid .label, .mermaid .node.solid foreignObject * {
        color: #FFFFFF !important; fill: #FFFFFF !important;
      }
      .mermaid .node.lime > rect, .mermaid .node.lime > polygon, .mermaid .node.lime > path {
        fill: ${THEME.green} !important; stroke: ${THEME.darkGreen} !important;
      }
      .mermaid .node.lime .nodeLabel, .mermaid .node.lime .label, .mermaid .node.lime foreignObject * {
        color: ${THEME.darkGreen} !important; fill: ${THEME.darkGreen} !important;
      }
      .mermaid .node.soft > rect, .mermaid .node.soft > polygon, .mermaid .node.soft > path {
        fill: ${THEME.greenBase} !important; stroke: ${THEME.darkGreen} !important;
      }
      .mermaid .node.soft .nodeLabel, .mermaid .node.soft .label, .mermaid .node.soft foreignObject * {
        color: ${THEME.darkGreen} !important; fill: ${THEME.darkGreen} !important;
      }
      /* TAP cyan variant — for authorization-layer / TAP message nodes. */
      .mermaid .node.cyan > rect, .mermaid .node.cyan > polygon, .mermaid .node.cyan > path {
        fill: ${THEME.cyanSoft} !important; stroke: ${THEME.cyan} !important;
      }
      .mermaid .node.cyan .nodeLabel, .mermaid .node.cyan .label, .mermaid .node.cyan foreignObject * {
        color: ${THEME.darkGreen} !important; fill: ${THEME.darkGreen} !important;
      }

      /* Node labels — slab serif, dark ink. */
      .mermaid .nodeLabel, .mermaid .node .label, .mermaid .node foreignObject div {
        font-family: 'Roboto Slab', Georgia, serif !important;
        font-size: 14px !important;
        letter-spacing: -.02em !important;
        color: ${THEME.darkGreen};
      }

      /* Cluster (subgraph) framing — TAP layered architecture vibe. */
      .mermaid .cluster rect {
        fill: ${THEME.beige} !important;
        stroke: ${THEME.darkGreen} !important;
        stroke-dasharray: 4 4 !important;
        stroke-width: 1px !important;
      }
      .mermaid .cluster .cluster-label,
      .mermaid .cluster .nodeLabel {
        font-family: 'Inter', sans-serif !important;
        font-weight: 700 !important;
        font-size: 11px !important;
        letter-spacing: 0.12em !important;
        text-transform: uppercase !important;
        color: ${THEME.darkGreen} !important;
        fill: ${THEME.darkGreen} !important;
      }

      /* Edge labels — mono, beige pill. */
      .mermaid .edgeLabel, .mermaid .edgeLabel p, .mermaid .edgeLabel span {
        font-family: 'Geist Mono', ui-monospace, monospace !important;
        font-size: 12px !important;
        letter-spacing: 0.02em !important;
        color: ${THEME.darkGreen} !important;
        background: ${THEME.beige} !important;
        padding: 2px 6px !important;
      }
      .mermaid .edgeLabel rect { fill: ${THEME.beige} !important; stroke: ${THEME.border} !important; }
      .mermaid .edgePath .path, .mermaid .flowchart-link {
        stroke: ${THEME.darkGreen} !important; stroke-width: 1.5px !important;
      }
      .mermaid .marker, .mermaid defs marker path {
        fill: ${THEME.darkGreen} !important; stroke: ${THEME.darkGreen} !important;
      }

      /* --- Sequence diagram --- */
      .mermaid .actor {
        fill: ${THEME.darkGreen} !important;
        stroke: ${THEME.darkGreen} !important;
        filter: drop-shadow(3px 3px 0 rgba(0,0,0,.12));
      }
      .mermaid text.actor, .mermaid text.actor > tspan {
        fill: #FFFFFF !important;
        font-family: 'Roboto Slab', Georgia, serif !important;
        font-weight: 500 !important;
        font-size: 14px !important;
      }
      .mermaid .actor-line {
        stroke: ${THEME.grey} !important;
        stroke-dasharray: 4 3 !important;
        opacity: .6;
      }
      .mermaid .messageLine0, .mermaid .messageLine1 {
        stroke: ${THEME.darkGreen} !important;
        stroke-width: 1.5px !important;
      }
      .mermaid .messageText {
        fill: ${THEME.darkGreen} !important;
        font-family: 'Geist Mono', ui-monospace, monospace !important;
        font-size: 12px !important;
      }
      .mermaid .sequenceNumber { fill: ${THEME.darkGreen} !important; }
      .mermaid text.sequenceNumber { fill: #FFFFFF !important; }
      .mermaid .note {
        fill: ${THEME.greenBase} !important;
        stroke: ${THEME.darkGreen} !important;
        filter: drop-shadow(3px 3px 0 rgba(0,0,0,.08));
      }
      .mermaid .noteText, .mermaid .noteText > tspan {
        fill: ${THEME.darkGreen} !important;
        font-family: 'Geist Mono', ui-monospace, monospace !important;
        font-size: 11px !important;
      }
      /* Activation rectangles = TAP cyan (authorization in flight). */
      .mermaid rect.activation0, .mermaid rect.activation1, .mermaid rect.activation2 {
        fill: ${THEME.cyanSoft} !important;
        stroke: ${THEME.cyan} !important;
        stroke-width: 1px !important;
      }
    `;
    document.head.appendChild(s);
  }

  /* Convert Jekyll-rendered ```mermaid``` blocks
     (`<pre><code class="language-mermaid">`) into `<div class="mermaid">`
     containers so mermaid can render them. */
  function convertCodeBlocks() {
    document.querySelectorAll('pre code.language-mermaid').forEach(function (el) {
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = el.textContent;
      const pre = el.parentElement;
      pre.parentElement.replaceChild(div, pre);
    });
  }

  /* Render an SVG string returned by mermaid into `el` without using innerHTML.
     Parses the markup as XML and replaces children with the resulting <svg> node. */
  function setSvg(el, svgMarkup) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgMarkup, 'image/svg+xml');
    const svg = doc.documentElement;
    if (svg && svg.nodeName.toLowerCase() === 'svg') {
      el.replaceChildren(document.importNode(svg, true));
    } else {
      el.replaceChildren(document.createTextNode('[mermaid: invalid SVG]'));
    }
  }

  async function runBlocks() {
    const blocks = document.querySelectorAll('div.mermaid, pre.mermaid');
    for (let i = 0; i < blocks.length; i++) {
      const el = blocks[i];
      if (el.dataset.processed === 'true') continue;
      const source = (el.dataset.source || el.textContent).trim();
      el.dataset.source = source;
      const id = 'tap-mmd-' + i + '-' + Math.random().toString(36).slice(2, 8);
      try {
        const { svg, bindFunctions } = await window.mermaid.render(id, source);
        setSvg(el, svg);
        if (bindFunctions) bindFunctions(el);
        el.dataset.processed = 'true';
      } catch (e) {
        console.error('[TapMermaid] render failed', e);
        const pre = document.createElement('pre');
        pre.style.cssText = 'color:#8A1B1B;font-family:monospace;font-size:11px';
        pre.textContent = String(e.message || e);
        el.replaceChildren(pre);
      }
    }
  }

  window.TapMermaid = {
    config: cfg,
    async init() {
      if (!window.mermaid) {
        console.warn('[TapMermaid] mermaid not loaded');
        return;
      }
      injectStyles();
      window.mermaid.initialize(cfg);
      convertCodeBlocks();
      await runBlocks();
    },
    rerun: runBlocks,
  };

  document.addEventListener('DOMContentLoaded', function () {
    window.TapMermaid.init();
  });
})();
