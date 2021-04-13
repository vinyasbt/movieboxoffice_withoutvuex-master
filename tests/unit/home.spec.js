import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";
import moxios from 'moxios';
import {getshow} from '../../src/show.service.js';

import {homeShows,searchShows} from './testdata.js'
describe("Home",()=>{
    beforeEach(function () {
        // import and pass your custom axios instance to this method
        moxios.install()
        
      })
      afterEach(function () {
        // import and pass your custom axios instance to this method
        moxios.uninstall();
      });
test('button click with correct message', () => {
    const wrapper=shallowMount(Home);
    expect(wrapper.vm.message).toBe('enter valid series name')
  })
  test('getting list works',(done)=>{
    const wrapper=shallowMount(Home);
      expect(wrapper.vm.allshows.length).toBe(0);
      expect(wrapper.vm.popular.length).toBe(0);
      moxios.wait(function () {
        let request = moxios.requests.mostRecent();
        request
          .respondWith({
            status: 200,
            response: homeShows,
          })
          .then(function () {
            expect(wrapper.vm.allshows.length).toBe(3);
            expect(wrapper.vm.popular.length).toBe(2);
            done();
          });
      });
  })
  test('search list works',(done)=>{
    const wrapper=shallowMount(Home);
      expect(wrapper.vm.searchshows.length).toBe(0);
      moxios.wait(function () {
        let request = moxios.requests.mostRecent();
        request
          .respondWith({
            status: 200,
            response: homeShows,
          })
          .then(function () {
            expect(wrapper.vm.searchshows.length).toBe(0);
            done();
          });
      });
  })

test('search method checking',async()=>{
  const wrapper=shallowMount(Home);
  // jest.mock('../../src/show.service.js');
  const searchshow=jest.fn();
  wrapper.setMethods({
    searchshow:searchshow
  })
  wrapper.vm.searchshow('suits');
  expect(wrapper.vm.searchshow).toBeCalledWith('suits')
  expect(wrapper.vm.searchshows.length).toBe(0);
  moxios.wait(function () {
    let request = moxios.requests.mostRecent();
    request
      .respondWith({
        status: 200,
        response: searchShows,
      })
      .then(function () {
        expect(wrapper.vm.searchshows.length).not.toBe(0);
        done();
      });
  });
})
})