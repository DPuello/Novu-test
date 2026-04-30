const bannerGrid = document.getElementById("banner-grid");
const banners = __BANNER_LIST__;

const emailFrame = document.getElementById("email-frame");
const nameInput = document.getElementById("test-name");
const emailInput = document.getElementById("test-email");
const openEmailOnlyButton = document.getElementById("open-email-only");
const sendEmailTestButton = document.getElementById("send-email-test");

const EMAIL_ROUTE = "./email/index.html";

let emailTemplatePromise;

const safe = (value) => value.trim().replace(/[\n\r]+/g, " ").slice(0, 120);

const getFormData = () => {
  const name = safe(nameInput.value) || "Usuario";
  return { name };
};

const formatNameWithComma = (name) => `${name.replace(/\s*,\s*$/, "")},`;

const reflectEmailDataInFrame = ({ name }) => {
  if (!emailFrame.contentDocument) {
    return;
  }

  const doc = emailFrame.contentDocument;
  const nameTargets = doc.querySelectorAll('[data-preview-name], #preview-name, .preview-name');
  const formattedName = formatNameWithComma(name);

  nameTargets.forEach((node) => {
    node.textContent = formattedName;
  });

};

const updateEmailActions = () => {
  openEmailOnlyButton.href = EMAIL_ROUTE;
};

const applyEmailData = ({ reloadFrame }) => {
  const data = getFormData();
  updateEmailActions(data);

  if (reloadFrame) {
    emailFrame.src = EMAIL_ROUTE;
    return;
  }

  reflectEmailDataInFrame(data);
};

const getEmailTemplateHtml = async () => {
  if (!emailTemplatePromise) {
    emailTemplatePromise = fetch(EMAIL_ROUTE, { cache: "no-store" }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`No se pudo cargar ${EMAIL_ROUTE}`);
      }
      return response.text();
    });
  }

  return emailTemplatePromise;
};

const buildPersonalizedEmailHtml = (html, { name }) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const nameTargets = doc.querySelectorAll('[data-preview-name], #preview-name, .preview-name');
  const formattedName = formatNameWithComma(name);

  nameTargets.forEach((node) => {
    node.textContent = formattedName;
  });

  const baseAssetsUrl = `${window.location.origin}/assets/`;
  const images = doc.querySelectorAll("img[src]");
  images.forEach((img) => {
    const src = img.getAttribute("src");
    if (!src) {
      return;
    }

    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
      return;
    }

    const fileName = src.split("/").pop();
    if (!fileName) {
      return;
    }

    img.setAttribute("src", `${baseAssetsUrl}${fileName}`);
  });

  return `<!doctype html>\n${doc.documentElement.outerHTML}`;
};

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  area.style.pointerEvents = "none";
  document.body.appendChild(area);
  area.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } finally {
    document.body.removeChild(area);
  }

  return copied;
};

const sendEmailTest = async () => {
  const data = getFormData();
  const rawHtml = await getEmailTemplateHtml();
  const personalizedHtml = buildPersonalizedEmailHtml(rawHtml, data);
  const copied = await copyText(personalizedHtml);

  if (copied) {
    window.alert("HTML compilado copiado. Pegalo en el editor HTML de tu plataforma de correo para enviar la prueba.");
    return;
  }

  const blob = new Blob([personalizedHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "novu-email-prueba.html";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
  window.alert("No se pudo copiar al portapapeles. Descargue novu-email-prueba.html para usarlo en tu envio de prueba.");
};

const bindInputAutoApply = (input) => {
  input.addEventListener("change", () => {
    applyEmailData({ reloadFrame: false });
  });

  input.addEventListener("blur", () => {
    applyEmailData({ reloadFrame: false });
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyEmailData({ reloadFrame: false });
      input.blur();
    }
  });
};

if (!banners.length) {
  bannerGrid.innerHTML = '<section class="empty">No hay banners con <code>index.html</code> dentro de <code>banners/*</code>.</section>';
} else {
  for (const banner of banners) {
    const card = document.createElement("section");
    card.className = "card";

    const row = document.createElement("div");
    row.className = "row";

    const labelWrap = document.createElement("div");
    const label = document.createElement("h3");
    const meta = document.createElement("div");

    label.className = "label";
    label.textContent = banner.id;

    meta.className = "meta";
    meta.textContent = "Preview";

    labelWrap.appendChild(label);
    labelWrap.appendChild(meta);

    const openButton = document.createElement("a");
    openButton.className = "btn secondary icon-only";
    openButton.href = banner.route;
    openButton.target = "_blank";
    openButton.rel = "noreferrer";
    openButton.innerHTML = `<svg width="23" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Inter#ffface / External_Link"> <path id="Vector" d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>`;

    row.appendChild(labelWrap);
    row.appendChild(openButton);

    const wrap = document.createElement("div");
    wrap.className = "frame-wrap";

    const frame = document.createElement("iframe");
    frame.className = "banner-frame";
    frame.loading = "lazy";
    frame.title = `${banner.id} preview`;
    frame.src = banner.route;
    frame.width = String(banner.width);
    frame.height = String(banner.height);

    wrap.appendChild(frame);
    card.appendChild(row);
    card.appendChild(wrap);
    bannerGrid.appendChild(card);
  }
}

bindInputAutoApply(nameInput);

sendEmailTestButton.addEventListener("click", async () => {
  try {
    await sendEmailTest();
  } catch (error) {
    window.alert(`No se pudo preparar el envio de prueba: ${error instanceof Error ? error.message : "error desconocido"}`);
  }
});

emailFrame.addEventListener("load", () => {
  applyEmailData({ reloadFrame: false });
});

applyEmailData({ reloadFrame: true });
