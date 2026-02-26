const STORAGE_KEY = "subscriptions";

export function getSubscriptions() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveSubscriptions(subscriptions) {
    localStorage.setItem(
        STORAGE_KEY, JSON.stringify(subscriptions)
    );
}

export function addSubscription(subscription) {
    const subscriptions = getSubscriptions();
    const newSubscription = {
        id: Date.now(),
        ...subscription,
    };

    subscriptions.push(newSubscription);
    saveSubscriptions(subscriptions);
}

export function deleteSubscription(id) {
    const subscriptions = getSubscriptions().filter(
        (sub) => sub.id !== id
    );
    saveSubscriptions(subscriptions);
}

export function updateSubscription(id, updatedData) {
    const subscriptions = getSubscriptions().map((sub) => sub.id === id ? { ...sub, ...updatedData } : sub);
    saveSubscriptions(subscriptions);
}