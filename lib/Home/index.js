class Home {
    constructor() {
        this.endpoints = {
            "endpoint-100": {
                "status": "OFF"
            }
        }
    }

    getEndpointStatus(id) {
        return this.endpoints[id]['status'];
    }

    switchEndpointStatus(id, newStatus) {
        this.endpoints[id]['status'] = newStatus
        return this.endpoints[id]['status'];
    }
}

module.exports = Home;