import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";
import moment from 'moment';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {

    const wrapper = mount(Posts, {router, store, localVue});

    it('1 == 1', function () {
        expect(true).toBe(true)
    });

    it('All rendered', () => {
        const posts = wrapper.findAll(".post");
        expect(posts.length).toEqual(testData.length);
    });

    it('Media rendered', () => {
        const posts = wrapper.findAll(".post");
        for(let i = 0; i < posts.length; i++){
            let post = posts.at(i);
            let postTest = testData[i];

            if(postTest.media){
                if(postTest.media.type === "video"){
                    expect(post.find('.post-image').find('video').exists()).toBe(true);
                }

                if(postTest.media.type === "image"){
                    expect(post.find('.post-image').find('img').exists()).toBe(true);
                }
            }
            else{
                expect(post.find('.post-image').exists()).toBe(false);
            }
        }
    });

    it('Timestamps are correct', () => {
        const posts = wrapper.findAll(".post");
        for (let i = 0; i < posts.length; i++) {
            let post = posts.at(i);
            let postTest = testData[i];
            let correct = moment(postTest.createTime).format('LLLL');
            expect(post.find('.post-author').findAll('small').at(1).text()).toEqual(correct)
        }
    });
});