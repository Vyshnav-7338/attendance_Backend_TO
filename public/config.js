
const useMinServer = true; 

function getApiUrl() {
    if (useMinServer) {
        return 'http://68.178.163.246:3004';
    } else {
        return 'http://localhost:3004';
    }
}
