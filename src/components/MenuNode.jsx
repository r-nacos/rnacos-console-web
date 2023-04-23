import {defineComponent} from 'vue'

export default defineComponent({
    props : ['name','children'],
    name:"MenuNode",
    data() {
        return {
            isTail:false
        }
    },
    methods: {

    },
    render () {
        const showSubItems = () => {
            if(this.children && this.children.length) {
                return (
                    <div>
                        {
                            this.children.map((item)=>{
                                return (
                                    <MenuNode  name={item.name} children={item.children}/>
                                )
                            })
                        }
                    </div>
                );
            }
            return null
        };
        return (
<div class='menu-node-wrap'>
    <div class='menu-node'>
        <span>{this.name}</span>
        <span>menu</span>
    </div>
    <div class='menu-children' >
        {showSubItems()}
    </div>
</div>
        )
    }
})

