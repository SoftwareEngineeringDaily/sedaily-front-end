export function preSelectedSubscriptionPlan () {
  const planType = localStorage.getItem('planType')
  return planType
}

export function wantedToSubscribe () {
  const planType = localStorage.getItem('planType')
  if (planType) {
    return true
  } else {
    return false
  }
}

// for when we don't want to subscribe anymore
export function unselectSubscriptionPlan () {
  localStorage.removeItem('planType')
}

export function selectSubscriptionPlan (planType) {
  localStorage.setItem('planType', planType)
}
