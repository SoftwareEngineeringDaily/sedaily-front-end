export default {

  createJob ({ commit, state, getters }, { companyName, applicationEmailAddress, location, title, description, employmentType, remoteWorkingConsidered }) {
    return this.$axios.post('/jobs', {
      companyName,
      applicationEmailAddress,
      location,
      title,
      description,
      employmentType,
      remoteWorkingConsidered
    })
  },
  updateJob ({ commit, state, getters }, { jobId, companyName, applicationEmailAddress, location, title, description, employmentType, remoteWorkingConsidered }) {
    return this.$axios.put(`/jobs/${jobId}`, {
      companyName,
      applicationEmailAddress,
      location,
      title,
      description,
      employmentType,
      remoteWorkingConsidered
    })
  },
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
  },

  deleteJob ({ commit, state, getters }, { jobId }) {
    return this.$axios.delete(`/jobs/${jobId}`)
  }

}
