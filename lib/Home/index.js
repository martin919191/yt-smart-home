class Home {
    constructor() {
        this.endpoints = {
            "endpoint-001": {
                "status": "OFF"
            }
        }
    }

    getEndpointStatus(id) {
        return this.endpoints[id]['status'];
    }

    switchEndpointStatus(id) {
        if (this.endpoints[id]['status'] == "OFF")
            this.endpoints[id]['status'] = "ON"
        else
            this.endpoints[id]['status'] = "OFF"
        return this.endpoints[id]['status'];
    }
}

module.exports = Home;