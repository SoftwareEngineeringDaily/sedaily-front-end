export function preSelectedSubscriptionPlan(store) {
  return store.state.planType
}

export function wantedToSubscribe (store) {
  const planType = preSelectedSubscriptionPlan(store)
  if (planType) {
    return true
  } else {
    return false
  }
}

// for when we don't want to subscribe anymore
export function unselectSubscriptionPlan (store) {
  store.state.planType = null
}

export function selectSubscriptionPlan (store, planType) {
  store.state.planType = planType
}
