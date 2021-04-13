<template>
  <div class="home">
    <Header @searchdata="searchshow" />
    <!-- <div>
  <b-carousel
    id="carousel-fade"
    fade
    indicators 
  >
    <b-carousel-slide 
      caption="Breaking Bad"
      img-src="http://static.tvmaze.com/uploads/images/medium_portrait/0/2400.jpg"
    > 
    <b-carousel-slide
      caption="Game of Thrones"
      img-src="http://static.tvmaze.com/uploads/images/medium_portrait/190/476117.jpg"
    ></b-carousel-slide>
    <b-carousel-slide
      caption="Suits"
      img-src="http://static.tvmaze.com/uploads/images/medium_portrait/205/513582.jpg"
    ></b-carousel-slide>
  </b-carousel>
</div> -->
    <b-container class="bv-example-row" v-if="searchshows.length>0">
      <b-row>
        <b-col
          md="4"
          lg="3"
          sm="3"
          v-for="(s, index) in searchshows"
          :key="index"
          id="grid"
        >
          <router-link :to="'/about/' + s.show.id">
            <br />
            <h4>{{ s.show.name }}</h4>
            <p v-if="s.show.image != null">
              <img v-bind:src="s.show.image.medium" id="image" />
            </p>
            <p v-else-if="!spinner">
              <!-- <b-spinner variant="light" type="grow"></b-spinner> -->
              <img src="../assets/images.jpg" id="imagenotfound" />
            </p>
            <span class="details">
              <b-icon icon="camera-reels-fill"></b-icon>{{ s.show.language }}

              <b-icon icon="calendar-minus"></b-icon>{{ s.show.status }}
            </span>
          </router-link>
        </b-col>
      </b-row>
    </b-container>
    <br />
    <br />
    <b-container class="bv-example-row" >
      <h3>Popular shows</h3>
      <br />
      <div v-if="!spinner">
        <b-row>
          <b-col
            md="4"
            lg="3"
            sm="3"
            v-for="(p, index) in popular"
            :key="index"
            id="grid"
          >
            <router-link :to="'/about/' + p.id">
              <br />
              <h4>{{ p.name }}</h4>
              <p v-if="p.image != null">
                <img v-bind:src="p.image.medium" id="image" />
              </p>
              <span class="details">
                <b-icon icon="camera-reels-fill"></b-icon>{{ p.language }}
                <b-icon icon="star-fill"></b-icon>{{ p.rating.average }}
                <!-- {{p.genres.map((gen)=>gen)}} -->
                <b-icon icon="calendar-minus"></b-icon>{{ p.status }}
              </span>
            </router-link>
          </b-col>
        </b-row>
      </div>
      <div v-else>
        <b-spinner variant="light" type="grow"></b-spinner>
      </div>
    </b-container>
    <br />
    <br />
    <b-container class="bv-example-row" >
      <div v-for="(g, index) in genres" :key="index">
        <br />
        <br />
        <h3>{{ g.name }}</h3>
        <br />
        <b-row>
          <b-col
            md="4"
            lg="3"
            sm="3"
            v-for="(gs, index) in g.genreshows"
            :key="index"
            id="grid"
          >
            <router-link :to="'/about/' + gs.id">
              <br />
              <h4>{{ gs.name }}</h4>
              <p v-if="gs.image != null">
                <img v-bind:src="gs.image.medium" id="image" />
              </p>
              <span class="details">
                <b-icon icon="camera-reels-fill"></b-icon>{{ gs.language }}
                <b-icon icon="star-fill"></b-icon>{{ gs.rating.average }}
                <b-icon icon="calendar-minus"></b-icon>{{ gs.status }}
              </span>
            </router-link>
          </b-col>
        </b-row>
      </div>
    </b-container>
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { getshow, getAllShows } from "../show.service.js";
export default {
  name: "Home",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      searchdata: "",
      searchshows: [],
      genreshows: [],
      allshows: [],
      popular: [],
      // conditionRender: true,
      message: "enter valid series name",
      spinner: true
    };
  },
  methods: {
    searchshow(searchdata) {
      console.log("in home", searchdata);
      if (searchdata != "") {
        getshow(searchdata).then(res => {
          this.searchshows = res.data;
        });
        // if (this.searchshows.length > 0) {
        //   this.conditionRender = false;
        // }
      } else {
        // this.message='enter valid series name';
        alert(this.message);
      }
    }
  },
  created() {
    getAllShows().then(res => {
      this.allshows = res.data;
      console.log("all shows", res.data);
      this.popular = this.allshows
        .filter(show => show.rating.average)
        .sort((a, b) => (a.rating.average < b.rating.average ? 1 : -1))
        .slice(0, 12);
      console.log("popular array", this.popular);
      this.spinner = false;
      // console.log("genre array",this.genreshows)
    });
  },
  computed: {
    genreTitles() {
      return Array.from(new Set(this.allshows.flatMap(shows => shows.genres)));
    },
    genres() {
      console.log("genre titles", this.genreTitles);
      return this.genreTitles.map(genre => {
        return {
          name: genre,
          genreshows: this.allshows
            .filter(show => show.genres.includes(genre))
            .filter(show => show.rating.average)
            .sort((a, b) => (a.rating.average < b.rating.average ? 1 : -1))
            .slice(0, 12)
        };
      });
    }
  }
};
</script>
<style scoped>
.grid {
  width: 300px;
  border-radius: 10px;
  border: 1px solid #f1f1f1;
  margin: 80px;
  float: left;
  height: 400px;
}
.search {
  margin: 10px;
}
.image {
  width: 290px;
  border-radius: 10px;
  /* border:1px solid #f1f1f1; */
  float: left;
  height: 330px;
}
#searchshows {
  background-color: black;
}
#popular {
  background-color: black;
}
h4 {
  color: azure;
}
h3 {
  color: lightgoldenrodyellow;
}
.details {
  color: antiquewhite;
}
.home {
  background-color: black;
}
#grid {
  width: 100%;
  border-radius: 10px;
  /* border:1px solid #f1f1f1; */
  /* margin:45px; */
  /* float: left; */
  height: 100%;
  /* padding: 20px;  */
}
#image {
  width: 80%;
  border-radius: 10px;
  /* border:1px solid #f1f1f1; */
  /* float: left; */
  height: 70%;
}
#image:hover {
  transform: scale(1.25);
}
#imagenotfound{
  width: 80%;
  border-radius: 10px;
height: 230px;
}
</style>