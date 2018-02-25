<template>
  <div>
    <h1> Contributors </h1>
    <p> Here are some of the people that are helping create SoftwareDaily. </a>

      <div v-for="contributor in alphabeticallyOrderedContributors">
        <div>
          <h3> {{contributor.name}} </h3>
          <p>
          Github: <span> {{contributor.github}}</span>
          <a v-bind:href="contributorGithub(contributor)" target="_blank" class="link">@{{contributor.github}} </a>.
          </p>
        </div>
      </div>

    <p> Sorry if anyone has been left out, please ping me. - Jason@softwaredaily.com </p>
  </div>
</template>


<script>
export default {
  name: 'ContributorsList',
  data () {
    return {
      contributors: [
        {
          'name': 'Dan',
          'github': 'dfcook'
        },
        {

          'name': 'Andrew',
          'github': 'andrewmarklloyd'
        }
      ]
    }
  },

  computed: {
    alphabeticallyOrderedContributors () {
      return this.contributors.sort((a, b) => {
        return a.github > b.github
      })
    }
  },

  methods: {
    contributorGithub (contributor) {
      return `https://github.com/${contributor.github}`
    }
  }
}
</script>
