<template>
  <div>
    <h1> Contributors </h1>
    <p> Here are some of the people that are helping create SoftwareDaily. </a>

      <div v-for="contributor in alphabeticallyOrderedContributors">
        <div>
          <h3> {{contributor.name}} </h3>
          <p>
          Github: <a v-bind:href="contributorGithub(contributor)" target="_blank" class="link">@{{contributor.github}}</a>
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
          'name': 'Daniel Cook',
          'github': 'dfcook'
        },
        {

          'name': 'Andrew',
          'github': 'andrewmarklloyd'
        },
        {
          'name': 'Keith Holliday',
          'github': 'TheHollidayInn'
        },
        {
          'name': 'Edgar Pino',
          'github': 'edgar971'
        },
        {
          'name': 'Josh Morel',
          'github': 'joshmorel'
        },
        {
          'name': 'Shreyans Sheth',
          'github': 'bholagabbar'
        },

        {
          'name': 'Shreyans Sheth',
          'github': 'bholagabbar'
        },
        {
          'name': 'Itay Komemy',
          'github': 'itaykomemy'
        },
          {
          'name': 'Jeffrey Meyerson',
          'github': 'crablar'
        },
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
