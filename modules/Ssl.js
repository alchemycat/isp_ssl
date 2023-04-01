const axios = require("axios");
const https = require("https");

const config = {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
};

class Ssl {
    async create(baseURL, subdomain, sslName) {
        return await axios.get(`${baseURL}&crtname=${subdomain}%5F${sslName}&dns_check=off&domain=${subdomain}%20www.${subdomain}&domain_name=${subdomain}&email=webmaster%40${subdomain}&enable_cert=on&from_webdomain=&func=letsencrypt.generate&hide_dns=&keylen=2048&out=xjson&skip_check_a_record=off&sok=ok&wildcard=off`, config);
    }

    async getSubdomains(baseURL) {
        return await axios.get(`${baseURL}&out=json&func=webdomain&op=get&plid=webdomain`, config);
    }
}

exports.Ssl = Ssl;