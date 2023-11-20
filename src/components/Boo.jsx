import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      name: 'boo'
    };
  },
  methods: {},
  render() {
    return <div>show: {this.name}</div>;
  }
});
