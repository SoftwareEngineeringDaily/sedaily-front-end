export function preSelectedSubscriptionPlan () {
  return localStorage.getItem('planType')
}

export function wantedToSubscribe () {
  return !!preSelectedSubscriptionPlan()
}

// for when we don't want to subscribe anymore
export function unselectSubscriptionPlan () {
  selectSubscriptionPlan(null)
}

export function selectSubscriptionPlan (planType) {
  localStorage.setItem('planType', planType)
}
