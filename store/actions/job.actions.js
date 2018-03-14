export default {
  
  applyToJob ({ commit, state, getters }, { jobId, coveringLetter, resume }) {
    const config = {
      'Authorization': 'Bearer ' + this.$auth.token,
      'Content-Type': 'multipart/form-data'
    }

    const formData = new FormData()
    formData.append('resume', resume)
    formData.append('coveringLetter', coveringLetter)

    return this.$axios.post(`/jobs/${jobId}/apply`, formData, config)
  },

  jobsSearch ({ commit, state, getters }, { companyName }) {
    let query = '?'
    if (companyName) {
      query += `companyName=${companyName}&`
    }

    return this.$axios.get(`/jobs${query}`)
      .then((response) => {
        const jobs = response.data
        commit('setJobs', { jobs })
        return jobs
      })
      .catch((error) => {
        commit('setJobs', { jobs: [] })
        throw error
      })
  }
}
