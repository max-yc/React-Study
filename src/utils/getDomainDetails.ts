interface DomainDetails {
  protocol: string;
  domain: string;
  port: string;
  fullUrl: string;
}

const getDomainDetails = (): DomainDetails => {
  const protocol = window.location.protocol.replace(/:$/, "");
  const domain = window.location.hostname;
  const port = window.location.port;

  return {
    protocol, // 例如: "https"
    domain, // 例如: "example.com"
    port: port || (protocol === "https" ? "443" : "80"), // 显示实际端口或默认端口
    fullUrl: port
      ? `${protocol}://${domain}:${port}`
      : `${protocol}://${domain}`,
  };
};

export { getDomainDetails };
