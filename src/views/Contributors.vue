<template>
  <div class='container'>
    <h1> Contributors </h1>
    <p> Here are some of the people that are helping create SoftwareDaily. </p>
    <div class="row">
      <div v-for="contributor in alphabeticallyOrderedContributors" :key="contributor.github" class="col-4 col-md-3 col-lg-2 text-center p-3">
        <a :href="contributorGithub(contributor)" target="_blank" class="link">
          <img :src="`${contributorGithub(contributor)}.png?size=100`" class="avatar"/>
          <p>{{`@${contributor.github}`}}</p>
        </a>
        <h5>{{contributor.name}}</h5>
      </div>
    </div>
    <p> Sorry if anyone has been left out, please ping me. - <a href="mailto:Jason@softwaredaily.com" target="_blank">Jason@softwaredaily.com</a> </p>
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
          'name': 'Itay Komemy',
          'github': 'itaykomemy'
        },
        {
          'name': 'Erika Hokanson',
          'github': 'erikawho'
        },
        {
          'name': 'Jeffrey Meyerson',
          'github': 'crablar'
        },
        {
          'name': 'Kurian Vithayathil',
          'github': 'kvithayathil'
        },
        {
          'name': 'Tofuus',
          'github': 'Tofuus'
        },
        {
          'name': 'Jacob Windle',
          'github': 'jaketothepast'
        },
        {
          'name': 'Richard Schneeman',
          'github': 'schneems'
        },
        {
          'name': 'Amokrane Chentir',
          'github': 'Amokrane'
        },
        {
          'name': 'Samuel Villavicencio',
          'github': 'samuelrey'
        },
        {
          'name': 'Christopher',
          'github': 'Canadauni'
        },
        {
          'name': 'Dileep Kumar',
          'github': 'dileep8014'
        },
        {
          'name': 'Murad Khan',
          'github': 'muradkhan101'
        },
        {
          'name': 'Carl Mungazi',
          'github': 'CarlMungazi'
        },
        {
          'name': 'Anderson Reyes',
          'github': 'AndersonReyes'
        },
        {
          'name': 'Syed Abbas',
          'github': 'skabbass1'
        },
        {
          'name': 'Craig Holliday',
          'github': 'themisterholliday'
        },
        {
          'name': 'Justin Lam',
          'github': 'justinctlam'
        },
        {
          'name': 'tonkatsu7',
          'github': 'tonkatsu7'
        },
        {
          'name': 'Jake Wernette',
          'github': 'werne2j'
        },
        {
          'name': 'Sarah F-K',
          'github': 'sfarnsworthkum'
        },
        {
          'name': 'Mohammad Sami AlMouhtaseb',
          'github': 'satnami'
        },
        {
          'name': 'Nathan Gelman',
          'github': 'nathanbacon'
        },
        {
          'name': 'nellycheboi12',
          'github': 'nellycheboi12'
        },
        {
          'name': 'Gabriel Simmer',
          'github': 'gmemstr'
        },
        {
          'name': 'Emily Carey',
          'github': 'EmilyRosina'
        }
      ]
    }
  },
  computed: {
    alphabeticallyOrderedContributors () {
      // eslint-disable-next-line
      return this.contributors.sort((a, b) => { return 0.5 - Math.random() })
    }
  },
  methods: {
    contributorGithub (contributor) {
      return `https://github.com/${contributor.github}`
    }
  }
}
</script>

<style scoped>
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
</style>
