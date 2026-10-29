const target = document.querySelector('#target');
const userAgentData = navigator.userAgentData;

const browser =
  userAgentData?.brands?.[2] ||
  userAgentData?.brands?.[1] ||
  userAgentData?.brands?.[0];
const browserName = browser?.brand || navigator.appName;
const browserVersion = browser?.version || navigator.appVersion;
const operatingSystem = userAgentData?.platform || navigator.platform;
const date = new Date();

const paragraphs = [
  `Browser: ${browserName}, ${browserVersion}`,
  `Operating system: ${operatingSystem}`,
  `Screen size: ${screen.width} x ${screen.height}`,
  `Available browser space: ${innerWidth} x ${innerHeight}`,
  `Date: ${date.toLocaleDateString('fi-FI', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`,
  `Time: ${date.toLocaleTimeString('fi-FI', {
    hour: '2-digit',
    minute: '2-digit',
  })}`,
];

paragraphs.forEach(text => {
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  target.appendChild(paragraph);
});
