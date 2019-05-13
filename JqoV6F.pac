function FindProxyForURL(url, host){
  to_proxy=["music.163.com", "interface.music.163.com", "p1.music.126.net", "p2.music.126.net", "p3.music.126.net", "p4.music.126.net"];
  if (to_proxy.includes(host)) {
    return "PROXY 158.199.142.239";
  }
  return "DIRECT";
}
