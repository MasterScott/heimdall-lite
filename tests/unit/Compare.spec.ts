import 'jest';
import Vue from 'vue';
import Vuetify from 'vuetify';
import {getModule} from 'vuex-module-decorators';
import {shallowMount, Wrapper} from '@vue/test-utils';
import Compare from '@/views/Compare.vue';
import Store from '../../src/store/store';
import DataStore from '../../src/store/data_store';
import FilteredDataModule from '@/store/data_filters';
import StatusCountModule, {StatusHash} from '@/store/status_counts';
import {readFileSync} from 'fs';
import {ComparisonContext} from '../../src/utilities/delta_util';
import InspecDataModule from '@/store/data_store';
import {
  removeAllFiles,
  selectAllFiles,
  testSamples,
  loadSample,
  loadAll,
  Sample,
  fileCompliance
} from '../util/testingUtils';

const vuetify = new Vuetify();
let wrapper: Wrapper<Vue>;

wrapper = shallowMount(Compare, {
  vuetify,
  propsData: {}
});

let filter_store = getModule(FilteredDataModule, Store);
let data_store = getModule(InspecDataModule, Store);
let status_count = getModule(StatusCountModule, Store);

let red_hat_control_count = 247;
let red_hat_delta = 27;
let nginx_control_count = 41;
let nginx_delta = 3;

beforeEach(() => {
  selectAllFiles();
});

describe('Compare table data', () => {
  loadSample('NGINX With Failing Tests');
  it('correctly counts controls with 1 file', () => {
    expect((wrapper.vm as any).control_sets.length).toBe(nginx_control_count);
  });

  it('does not recount same controls with 2 files', () => {
    loadSample('NGINX With Failing Tests');
    expect((wrapper.vm as any).control_sets.length).toBe(nginx_control_count);
  });

  it('does not show any changed between two of the same', () => {
    expect((wrapper.vm as any).show_sets.length).toBe(0);
  });

  it('does not recount same controls with 3 files', () => {
    loadSample('NGINX With Failing Tests');
    expect((wrapper.vm as any).control_sets.length).toBe(nginx_control_count);
  });

  it('search works when nothing fits criteria', () => {
    (wrapper.vm as any).search_term = 'failed';
    expect((wrapper.vm as any).show_sets.length).toBe(0);
  });
  (wrapper.vm as any).search_term = '';

  it('search id works', () => {
    (wrapper.vm as any).checkbox = false;
    (wrapper.vm as any).search_term = 'v-13613';
    expect((wrapper.vm as any).show_sets.length).toBe(1);
  });

  it('does not recount same control with different data', () => {
    (wrapper.vm as any).search_term = '';
    (wrapper.vm as any).checkbox = true;
    loadSample('NGINX Clean Sample');
    expect((wrapper.vm as any).control_sets.length).toBe(nginx_control_count);
  });

  it('shows differing delta data when "show only changed"', () => {
    expect((wrapper.vm as any).show_sets.length).toBe(nginx_delta);
  });

  it('search status works', () => {
    (wrapper.vm as any).checkbox = false;
    (wrapper.vm as any).search_term = 'failed';
    expect((wrapper.vm as any).show_sets.length).toBe(nginx_delta);
  });

  it('counts every unique control', () => {
    loadSample('Red Hat With Failing Tests');
    selectAllFiles();
    (wrapper.vm as any).search_term = '';
    (wrapper.vm as any).checkbox = true;
    expect((wrapper.vm as any).control_sets.length).toBe(
      nginx_control_count + red_hat_control_count
    );
  });

  it('doesnt show data of controls with one instance when "show only changed"', () => {
    expect((wrapper.vm as any).show_sets.length).toBe(nginx_delta);
  });

  it('shows all delta data of controls with multiple occurances when "show only changed"', () => {
    loadSample('Red Hat Clean Sample');
    selectAllFiles();
    expect((wrapper.vm as any).show_sets.length).toBe(
      nginx_delta + red_hat_delta
    );
  });

  it('ComparisonContext counts status correctly', () => {
    let failed = 0;
    let passed = 0;
    let na = 0;
    let nr = 0;
    let pe = 0;
    let selected_data = filter_store.evaluations(
      filter_store.selected_file_ids
    );
    let curr_delta = new ComparisonContext(selected_data);
    for (let pairing of Object.values(curr_delta.pairings)) {
      for (let ctrl of pairing) {
        if (ctrl === null) {
          continue;
        } else if (ctrl!.root.hdf.status == 'Passed') {
          passed++;
        } else if (ctrl!.root.hdf.status == 'Failed') {
          failed++;
        } else if (ctrl!.root.hdf.status == 'Not Applicable') {
          na++;
        } else if (ctrl!.root.hdf.status == 'Not Reviewed') {
          nr++;
        } else if (ctrl!.root.hdf.status == 'Profile Error') {
          pe++;
        }
      }
    }
    let expected = status_count.hash({
      omit_overlayed_controls: true,
      fromFile: [...filter_store.selected_file_ids]
    });
    let actual: StatusHash = {
      Failed: failed,
      Passed: passed,
      'From Profile': 0,
      'Profile Error': pe,
      'Not Reviewed': nr,
      'Not Applicable': na
    };
    expect(actual).toEqual(expected);
  });
});

describe('compare charts', () => {
  it('sev chart gets correct data with 2 files', () => {
    removeAllFiles();
    loadSample('NGINX With Failing Tests');
    loadSample('NGINX Clean Sample');
    selectAllFiles();
    //the values in expected are the correct data
    expect((wrapper.vm as any).sev_series).toEqual([
      [0, 0],
      [3, 0],
      [0, 0],
      [0, 0]
    ]);
  });

  it('sev chart gets correct data with 2 files with differing profiles', () => {
    removeAllFiles();
    loadSample('NGINX With Failing Tests');
    loadSample('Red Hat With Failing Tests');
    selectAllFiles();
    //the values in expected are the correct data
    expect((wrapper.vm as any).sev_series).toEqual([
      [0, 6],
      [3, 18],
      [0, 3],
      [0, 0]
    ]);
  });

  it('sev chart gets correct data with 2 files with overlayed profiles', () => {
    removeAllFiles();
    loadSample('Triple Overlay Example');
    loadSample('Acme Overlay');
    selectAllFiles();
    //the values in expected are the correct data
    expect((wrapper.vm as any).sev_series).toEqual([
      [3, 0],
      [51, 0],
      [1, 0],
      [0, 60]
    ]);
  });

  it('sev chart gets correct data with all test files', () => {
    removeAllFiles();
    loadAll();
    selectAllFiles();
    let data = getModule(DataStore, Store);
    let failed = 0;
    let sevFail = 0;
    let exec_files = data.executionFiles;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < exec_files.length; j++) {
        sevFail += (wrapper.vm as any).sev_series[i][j];
      }
    }

    // For each, we will filter then count
    exec_files.forEach(file => {
      // Get the corresponding count file
      let count_filename = `tests/hdf_data/counts/${file.filename}.info.counts`;
      let count_file_content = readFileSync(count_filename, 'utf-8');
      let counts: any = JSON.parse(count_file_content);

      failed += counts.failed.total;
    });
    expect(sevFail).toBe(failed);
  });

  it('compliance chart gets correct data with 2 files', () => {
    removeAllFiles();
    loadSample('NGINX With Failing Tests');
    loadSample('NGINX Clean Sample');
    selectAllFiles();
    expect((wrapper.vm as any).compliance_series[0].data).toEqual([
      fileCompliance(filter_store.selected_file_ids[0]),
      fileCompliance(filter_store.selected_file_ids[1])
    ]);
  });

  it('compliance chart gets correct data with 2 files with differing profiles', () => {
    removeAllFiles();
    loadSample('NGINX With Failing Tests');
    loadSample('Red Hat With Failing Tests');
    selectAllFiles();
    expect((wrapper.vm as any).compliance_series[0].data).toEqual([
      fileCompliance(filter_store.selected_file_ids[0]),
      fileCompliance(filter_store.selected_file_ids[1])
    ]);
  });

  it('compliance chart gets correct data with 2 files with overlayed profiles', () => {
    removeAllFiles();
    loadSample('Triple Overlay Example');
    loadSample('Acme Overlay');
    selectAllFiles();
    expect((wrapper.vm as any).compliance_series[0].data).toEqual([
      fileCompliance(filter_store.selected_file_ids[0]),
      fileCompliance(filter_store.selected_file_ids[1])
    ]);
  });

  it('compliance chart gets correct data with all test files', () => {
    removeAllFiles();
    loadAll();
    selectAllFiles();
    let expected = [];
    for (let id of filter_store.selected_file_ids) {
      expected.push(fileCompliance(id));
    }
    expect((wrapper.vm as any).compliance_series[0].data.sort()).toEqual(
      expected.sort()
    );
  });

  it('displays correct number of donuts', () => {
    removeAllFiles();
    loadAll();
    selectAllFiles();
    expect((wrapper.vm as any).files.length).toBe(data_store.allFiles.length);
  });
});
