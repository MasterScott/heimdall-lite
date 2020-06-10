"use strict";
/**
 * This module provides a cached, reusable method for filtering data from data_store.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vuex_module_decorators_1 = require("vuex-module-decorators");
const data_store_1 = tslib_1.__importStar(require("@/store/data_store"));
const store_1 = tslib_1.__importDefault(require("@/store/store"));
const lru_cache_1 = tslib_1.__importDefault(require("lru-cache"));
const inspecjs_1 = require("inspecjs");
const MAX_CACHE_ENTRIES = 20;
/**
 * Facillitates the search functionality
 * @param term The string to search with
 * @param context_control The control to search for term in
 */
function contains_term(context_control, term) {
    let as_hdf = context_control.root.hdf;
    // Get our (non-null) searchable data
    let searchables = [
        as_hdf.wraps.id,
        as_hdf.wraps.title,
        as_hdf.wraps.code,
        as_hdf.severity,
        as_hdf.status,
        as_hdf.finding_details
    ].filter(s => s !== null);
    // See if any contain term
    return searchables.some(s => s.toLowerCase().includes(term));
}
let FilteredDataModule = class FilteredDataModule extends vuex_module_decorators_1.VuexModule {
    get dataStore() {
        return vuex_module_decorators_1.getModule(data_store_1.default, store_1.default);
    }
    /**
     * Parameterized getter.
     * Get all profiles from the specified file id.
     * Filters only based on the file ID
     */
    get profiles() {
        // Setup a cache for this run
        const depends = this.dataStore.contextualProfiles;
        const localCache = new lru_cache_1.default(MAX_CACHE_ENTRIES);
        return (file) => {
            // Generate a cache id
            let cached = localCache.get(file);
            if (cached !== undefined) {
                return cached;
            }
            // Initialize our list to add valid profiles to
            let profiles = [];
            // Filter to those that match our filter. In this case that just means come from the right file id
            this.dataStore.contextualProfiles.forEach(prof => {
                if (data_store_1.isFromProfileFile(prof)) {
                    if (prof.from_file.unique_id === file) {
                        profiles.push(prof);
                    }
                }
                else {
                    // Its a report; go two levels up to get its file
                    let ev = prof.sourced_from;
                    if (ev.from_file.unique_id === file) {
                        profiles.push(prof);
                    }
                }
            });
            return profiles;
        };
    }
    /**
     * Parameterized getter.
     * Get all controls from all profiles from the specified file id.
     * Utlizes the profiles getter to accelerate the file filter.
     */
    get controls() {
        /** Cache by filter */
        const depends = this.dataStore.contextualControls;
        const localCache = new lru_cache_1.default(MAX_CACHE_ENTRIES);
        return (filter = {}) => {
            // Generate a hash for cache purposes.
            // If the "search_term" string is not null, we don't cache - no need to pollute
            let id = filter_cache_key(filter);
            // Check if we have this cached:
            let cached = localCache.get(id);
            if (cached !== undefined) {
                return cached;
            }
            // First get all of the profiles using the same filter
            let profiles;
            let controls;
            if (filter.fromFile !== undefined) {
                // Get profiles
                profiles = this.profiles(filter.fromFile);
                // And all the controls they contain
                controls = profiles.flatMap(profile => profile.contains);
            }
            else {
                // No file filter => we don't care about profile. Jump directly to the full control list
                controls = this.dataStore.contextualControls;
            }
            // Filter by control id
            if (filter.control_id !== undefined) {
                controls = controls.filter(c => c.data.id === filter.control_id);
            }
            // Filter by status, if necessary
            if (filter.status !== undefined) {
                controls = controls.filter(control => control.root.hdf.status === filter.status);
            }
            // Filter by severity, if necessary
            if (filter.severity !== undefined) {
                controls = controls.filter(control => control.root.hdf.severity === filter.severity);
            }
            // Filter by overlay
            if (filter.omit_overlayed_controls) {
                controls = controls.filter(control => control.extended_by.length === 0);
            }
            // Filter by search term
            if (filter.search_term !== undefined) {
                let term = filter.search_term.toLowerCase();
                // Filter controls to those that contain search term
                controls = controls.filter(c => contains_term(c, term));
            }
            // Filter by nist stuff
            if (filter.tree_filters && filter.tree_filters.length > 0) {
                // Shorthand the nist filters
                let f = filter.tree_filters;
                // Construct a nist control to represent the filter
                let control = new inspecjs_1.nist.NistControl(filter.tree_filters);
                controls = controls.filter(c => {
                    // Get an hdf version so we have the fixed nist tags
                    return c.root.hdf.parsed_nist_tags.some(t => control.contains(t));
                });
            }
            // Freeze and save to cache
            let r = Object.freeze(controls);
            localCache.set(id, r);
            return r;
        };
    }
};
FilteredDataModule = tslib_1.__decorate([
    vuex_module_decorators_1.Module({
        namespaced: true,
        dynamic: true,
        store: store_1.default,
        name: "filteredData"
    })
], FilteredDataModule);
exports.default = FilteredDataModule;
/**
 * Generates a unique string to represent a filter.
 * Does some minor "acceleration" techniques such as
 * - annihilating empty search terms
 * - defaulting "omit_overlayed_controls"
 */
function filter_cache_key(f) {
    // fix the search term
    let new_search;
    if (f.search_term !== undefined) {
        new_search = f.search_term.trim();
    }
    else {
        new_search = "";
    }
    let new_f = {
        search_term: new_search,
        omit_overlayed_controls: f.omit_overlayed_controls || false,
        ...f
    };
    return JSON.stringify(new_f);
}
exports.filter_cache_key = filter_cache_key;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL3Nqb3NoaS90ZXN0L2hlaW1kYWxsLWxpdGUvc3JjL3N0b3JlL2RhdGFfZmlsdGVycy50cyIsIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7OztBQUVILG1FQUF1RTtBQUN2RSx5RUFJNEI7QUFHNUIsa0VBQWtDO0FBQ2xDLGtFQUFpQztBQUNqQyx1Q0FBeUM7QUFFekMsTUFBTSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFzQzdCOzs7O0dBSUc7QUFDSCxTQUFTLGFBQWEsQ0FDcEIsZUFBOEMsRUFDOUMsSUFBWTtJQUVaLElBQUksTUFBTSxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ3RDLHFDQUFxQztJQUNyQyxJQUFJLFdBQVcsR0FBYTtRQUMxQixNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDZixNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUs7UUFDbEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJO1FBQ2pCLE1BQU0sQ0FBQyxRQUFRO1FBQ2YsTUFBTSxDQUFDLE1BQU07UUFDYixNQUFNLENBQUMsZUFBZTtLQUN2QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQWEsQ0FBQztJQUV0QywwQkFBMEI7SUFDMUIsT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQy9ELENBQUM7QUFRRCxJQUFNLGtCQUFrQixHQUF4QixNQUFNLGtCQUFtQixTQUFRLG1DQUFVO0lBQ3pDLElBQVksU0FBUztRQUNuQixPQUFPLGtDQUFTLENBQUMsb0JBQVUsRUFBRSxlQUFLLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILElBQUksUUFBUTtRQUNWLDZCQUE2QjtRQUM3QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDO1FBQ2xELE1B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LENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BFLENBQUMsQ0FBQyxDQUFDO2FBQ0o7WUFFRCwyQkFBMkI7WUFDM0IsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN0QixPQUFPLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFBO0FBeElLLGtCQUFrQjtJQU52QiwrQkFBTSxDQUFDO1FBQ04sVUFBVSxFQUFFLElBQUk7UUFDaEIsT0FBTyxFQUFFLElBQUk7UUFDYixLQUFLLEVBQUUsZUFBSztRQUNaLElBQUksRUFBRSxjQUFjO0tBQ3JCLENBQUM7R0FDSSxrQkFBa0IsQ0F3SXZCO0FBRUQsa0JBQWUsa0JBQWtCLENBQUM7QUFFbEM7Ozs7O0dBS0c7QUFDSCxTQUFnQixnQkFBZ0IsQ0FBQyxDQUFTO0lBQ3hDLHNCQUFzQjtJQUN0QixJQUFJLFVBQWtCLENBQUM7SUFDdkIsSUFBSSxDQUFDLENBQUMsV0FBVyxLQUFLLFNBQVMsRUFBRTtRQUMvQixVQUFVLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNuQztTQUFNO1FBQ0wsVUFBVSxHQUFHLEVBQUUsQ0FBQztLQUNqQjtJQUVELElBQUksS0FBSyxHQUFXO1FBQ2xCLFdBQVcsRUFBRSxVQUFVO1FBQ3ZCLHVCQUF1QixFQUFFLENBQUMsQ0FBQyx1QkFBdUIsSUFBSSxLQUFLO1FBQzNELEdBQUcsQ0FBQztLQUNMLENBQUM7SUFDRixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQWZELDRDQWVDIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIi9Vc2Vycy9zam9zaGkvdGVzdC9oZWltZGFsbC1saXRlL3NyYy9zdG9yZS9kYXRhX2ZpbHRlcnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGlzIG1vZHVsZSBwcm92aWRlcyBhIGNhY2hlZCwgcmV1c2FibGUgbWV0aG9kIGZvciBmaWx0ZXJpbmcgZGF0YSBmcm9tIGRhdGFfc3RvcmUuXG4gKi9cblxuaW1wb3J0IHsgTW9kdWxlLCBWdWV4TW9kdWxlLCBnZXRNb2R1bGUgfSBmcm9tIFwidnVleC1tb2R1bGUtZGVjb3JhdG9yc1wiO1xuaW1wb3J0IERhdGFNb2R1bGUsIHtcbiAgU291cmNlZENvbnRleHR1YWxpemVkUHJvZmlsZSxcbiAgU291cmNlZENvbnRleHR1YWxpemVkRXZhbHVhdGlvbixcbiAgaXNGcm9tUHJvZmlsZUZpbGVcbn0gZnJvbSBcIkAvc3RvcmUvZGF0YV9zdG9yZVwiO1xuaW1wb3J0IHsgQ29udHJvbFN0YXR1cywgU2V2ZXJpdHkgfSBmcm9tIFwiaW5zcGVjanNcIjtcbmltcG9ydCB7IEZpbGVJRCB9IGZyb20gXCJAL3N0b3JlL3JlcG9ydF9pbnRha2VcIjtcbmltcG9ydCBTdG9yZSBmcm9tIFwiQC9zdG9yZS9zdG9yZVwiO1xuaW1wb3J0IExSVUNhY2hlIGZyb20gXCJscnUtY2FjaGVcIjtcbmltcG9ydCB7IGNvbnRleHQsIG5pc3QgfSBmcm9tIFwiaW5zcGVjanNcIjtcblxuY29uc3QgTUFYX0NBQ0hFX0VOVFJJRVMgPSAyMDtcblxuLyoqIENvbnRhaW5zIGNvbW1vbiBmaWx0ZXJzIG9uIGRhdGEgZnJvbSB0aGUgc3RvcmUuICovXG5leHBvcnQgaW50ZXJmYWNlIEZpbHRlciB7XG4gIC8vIEdlbmVyYWxcbiAgLyoqIFdoaWNoIGZpbGUgdGhlc2Ugb2JqZWN0cyBjYW1lIGZyb20uIFVuZGVmaW5lZCA9PiBhbnkgKi9cbiAgZnJvbUZpbGU/OiBGaWxlSUQ7XG5cbiAgLy8gQ29udHJvbCBzcGVjaWZpY1xuICAvKiogV2hhdCBzdGF0dXMgdGhlIGNvbnRyb2xzIGNhbiBoYXZlLiBVbmRlZmluZWQgPT4gYW55ICovXG4gIHN0YXR1cz86IENvbnRyb2xTdGF0dXM7XG5cbiAgLyoqIFdoYXQgc2V2ZXJpdHkgdGhlIGNvbnRyb2xzIGNhbiBoYXZlLiBVbmRlZmluZWQgPT4gYW55ICovXG4gIHNldmVyaXR5PzogU2V2ZXJpdHk7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRvIGFsbG93L2luY2x1ZGUgb3ZlcmxheWVkIGNvbnRyb2xzICovXG4gIG9taXRfb3ZlcmxheWVkX2NvbnRyb2xzPzogYm9vbGVhbjtcblxuICAvKiogQSBzZWFyY2ggdGVybSBzdHJpbmcsIGNhc2UgaW5zZW5zaXRpdmVcbiAgICogV2UgbG9vayBmb3IgdGhpcyBpblxuICAgKiAtIGNvbnRyb2wgSURcbiAgICogLSBydWxlIHRpdGxlXG4gICAqIC0gc2V2ZXJpdHlcbiAgICogLSBzdGF0dXNcbiAgICogLSBmaW5kaW5nIGRldGFpbHMgKGZyb20gSERGKVxuICAgKiAtIGNvZGVcbiAgICovXG4gIHNlYXJjaF90ZXJtPzogc3RyaW5nO1xuXG4gIC8qKiBUaGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgTmlzdCBUcmVlbWFwLiBVc2VkIHRvIGZ1cnRoZXIgZmlsdGVyIGJ5IG5pc3QgY2F0ZWdvcmllcyBldGMuICovXG4gIHRyZWVfZmlsdGVycz86IFRyZWVNYXBTdGF0ZTtcblxuICAvKiogQSBzcGVjaWZpYyBjb250cm9sIGlkICovXG4gIGNvbnRyb2xfaWQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIFRyZWVNYXBTdGF0ZSA9IHN0cmluZ1tdOyAvLyBSZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgcGF0aCBzcGVjLCBmcm9tIHJvb3RcblxuLyoqXG4gKiBGYWNpbGxpdGF0ZXMgdGhlIHNlYXJjaCBmdW5jdGlvbmFsaXR5XG4gKiBAcGFyYW0gdGVybSBUaGUgc3RyaW5nIHRvIHNlYXJjaCB3aXRoXG4gKiBAcGFyYW0gY29udGV4dF9jb250cm9sIFRoZSBjb250cm9sIHRvIHNlYXJjaCBmb3IgdGVybSBpblxuICovXG5mdW5jdGlvbiBjb250YWluc190ZXJtKFxuICBjb250ZXh0X2NvbnRyb2w6IGNvbnRleHQuQ29udGV4dHVhbGl6ZWRDb250cm9sLFxuICB0ZXJtOiBzdHJpbmdcbik6IGJvb2xlYW4ge1xuICBsZXQgYXNfaGRmID0gY29udGV4dF9jb250cm9sLnJvb3QuaGRmO1xuICAvLyBHZXQgb3VyIChub24tbnVsbCkgc2VhcmNoYWJsZSBkYXRhXG4gIGxldCBzZWFyY2hhYmxlczogc3RyaW5nW10gPSBbXG4gICAgYXNfaGRmLndyYXBzLmlkLFxuICAgIGFzX2hkZi53cmFwcy50aXRsZSxcbiAgICBhc19oZGYud3JhcHMuY29kZSxcbiAgICBhc19oZGYuc2V2ZXJpdHksXG4gICAgYXNfaGRmLnN0YXR1cyxcbiAgICBhc19oZGYuZmluZGluZ19kZXRhaWxzXG4gIF0uZmlsdGVyKHMgPT4gcyAhPT0gbnVsbCkgYXMgc3RyaW5nW107XG5cbiAgLy8gU2VlIGlmIGFueSBjb250YWluIHRlcm1cbiAgcmV0dXJuIHNlYXJjaGFibGVzLnNvbWUocyA9PiBzLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGVybSkpO1xufVxuXG5ATW9kdWxlKHtcbiAgbmFtZXNwYWNlZDogdHJ1ZSxcbiAgZHluYW1pYzogdHJ1ZSxcbiAgc3RvcmU6IFN0b3JlLFxuICBuYW1lOiBcImZpbHRlcmVkRGF0YVwiXG59KVxuY2xhc3MgRmlsdGVyZWREYXRhTW9kdWxlIGV4dGVuZHMgVnVleE1vZHVsZSB7XG4gIHByaXZhdGUgZ2V0IGRhdGFTdG9yZSgpOiBEYXRhTW9kdWxlIHtcbiAgICByZXR1cm4gZ2V0TW9kdWxlKERhdGFNb2R1bGUsIFN0b3JlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJhbWV0ZXJpemVkIGdldHRlci5cbiAgICogR2V0IGFsbCBwcm9maWxlcyBmcm9tIHRoZSBzcGVjaWZpZWQgZmlsZSBpZC5cbiAgICogRmlsdGVycyBvbmx5IGJhc2VkIG9uIHRoZSBmaWxlIElEXG4gICAqL1xuICBnZXQgcHJvZmlsZXMoKTogKGZpbGU6IEZpbGVJRCkgPT4gcmVhZG9ubHkgY29udGV4dC5Db250ZXh0dWFsaXplZFByb2ZpbGVbXSB7XG4gICAgLy8gU2V0dXAgYSBjYWNoZSBmb3IgdGhpcyBydW5cbiAgICBjb25zdCBkZXBlbmRzID0gdGhpcy5kYXRhU3RvcmUuY29udGV4dHVhbFByb2ZpbGVzO1xuICAgIGNvbnN0IGxvY2FsQ2FjaGU6IExSVUNhY2hlPFxuICAgICAgRmlsZUlELFxuICAgICAgY29udGV4dC5Db250ZXh0dWFsaXplZFByb2ZpbGVbXVxuICAgID4gPSBuZXcgTFJVQ2FjaGUoTUFYX0NBQ0hFX0VOVFJJRVMpO1xuXG4gICAgcmV0dXJuIChmaWxlOiBGaWxlSUQpID0+IHtcbiAgICAgIC8vIEdlbmVyYXRlIGEgY2FjaGUgaWRcbiAgICAgIGxldCBjYWNoZWQgPSBsb2NhbENhY2hlLmdldChmaWxlKTtcbiAgICAgIGlmIChjYWNoZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gY2FjaGVkO1xuICAgICAgfVxuXG4gICAgICAvLyBJbml0aWFsaXplIG91ciBsaXN0IHRvIGFkZCB2YWxpZCBwcm9maWxlcyB0b1xuICAgICAgbGV0IHByb2ZpbGVzOiBjb250ZXh0LkNvbnRleHR1YWxpemVkUHJvZmlsZVtdID0gW107XG5cbiAgICAgIC8vIEZpbHRlciB0byB0aG9zZSB0aGF0IG1hdGNoIG91ciBmaWx0ZXIuIEluIHRoaXMgY2FzZSB0aGF0IGp1c3QgbWVhbnMgY29tZSBmcm9tIHRoZSByaWdodCBmaWxlIGlkXG4gICAgICB0aGlzLmRhdGFTdG9yZS5jb250ZXh0dWFsUHJvZmlsZXMuZm9yRWFjaChwcm9mID0+IHtcbiAgICAgICAgaWYgKGlzRnJvbVByb2ZpbGVGaWxlKHByb2YpKSB7XG4gICAgICAgICAgaWYgKHByb2YuZnJvbV9maWxlLnVuaXF1ZV9pZCA9PT0gZmlsZSkge1xuICAgICAgICAgICAgcHJvZmlsZXMucHVzaChwcm9mKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSXRzIGEgcmVwb3J0OyBnbyB0d28gbGV2ZWxzIHVwIHRvIGdldCBpdHMgZmlsZVxuICAgICAgICAgIGxldCBldiA9IHByb2Yuc291cmNlZF9mcm9tIGFzIFNvdXJjZWRDb250ZXh0dWFsaXplZEV2YWx1YXRpb247XG4gICAgICAgICAgaWYgKGV2LmZyb21fZmlsZS51bmlxdWVfaWQgPT09IGZpbGUpIHtcbiAgICAgICAgICAgIHByb2ZpbGVzLnB1c2gocHJvZik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHByb2ZpbGVzO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUGFyYW1ldGVyaXplZCBnZXR0ZXIuXG4gICAqIEdldCBhbGwgY29udHJvbHMgZnJvbSBhbGwgcHJvZmlsZXMgZnJvbSB0aGUgc3BlY2lmaWVkIGZpbGUgaWQuXG4gICAqIFV0bGl6ZXMgdGhlIHByb2ZpbGVzIGdldHRlciB0byBhY2NlbGVyYXRlIHRoZSBmaWxlIGZpbHRlci5cbiAgICovXG4gIGdldCBjb250cm9scygpOiAoZmlsdGVyOiBGaWx0ZXIpID0+IHJlYWRvbmx5IGNvbnRleHQuQ29udGV4dHVhbGl6ZWRDb250cm9sW10ge1xuICAgIC8qKiBDYWNoZSBieSBmaWx0ZXIgKi9cbiAgICBjb25zdCBkZXBlbmRzID0gdGhpcy5kYXRhU3RvcmUuY29udGV4dHVhbENvbnRyb2xzO1xuICAgIGNvbnN0IGxvY2FsQ2FjaGU6IExSVUNhY2hlPFxuICAgICAgc3RyaW5nLFxuICAgICAgcmVhZG9ubHkgY29udGV4dC5Db250ZXh0dWFsaXplZENvbnRyb2xbXVxuICAgID4gPSBuZXcgTFJVQ2FjaGUoTUFYX0NBQ0hFX0VOVFJJRVMpO1xuXG4gICAgcmV0dXJuIChmaWx0ZXI6IEZpbHRlciA9IHt9KSA9PiB7XG4gICAgICAvLyBHZW5lcmF0ZSBhIGhhc2ggZm9yIGNhY2hlIHB1cnBvc2VzLlxuICAgICAgLy8gSWYgdGhlIFwic2VhcmNoX3Rlcm1cIiBzdHJpbmcgaXMgbm90IG51bGwsIHdlIGRvbid0IGNhY2hlIC0gbm8gbmVlZCB0byBwb2xsdXRlXG4gICAgICBsZXQgaWQ6IHN0cmluZyA9IGZpbHRlcl9jYWNoZV9rZXkoZmlsdGVyKTtcblxuICAgICAgLy8gQ2hlY2sgaWYgd2UgaGF2ZSB0aGlzIGNhY2hlZDpcbiAgICAgIGxldCBjYWNoZWQgPSBsb2NhbENhY2hlLmdldChpZCk7XG4gICAgICBpZiAoY2FjaGVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGNhY2hlZDtcbiAgICAgIH1cblxuICAgICAgLy8gRmlyc3QgZ2V0IGFsbCBvZiB0aGUgcHJvZmlsZXMgdXNpbmcgdGhlIHNhbWUgZmlsdGVyXG4gICAgICBsZXQgcHJvZmlsZXM6IHJlYWRvbmx5IGNvbnRleHQuQ29udGV4dHVhbGl6ZWRQcm9maWxlW107XG4gICAgICBsZXQgY29udHJvbHM6IHJlYWRvbmx5IGNvbnRleHQuQ29udGV4dHVhbGl6ZWRDb250cm9sW107XG4gICAgICBpZiAoZmlsdGVyLmZyb21GaWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gR2V0IHByb2ZpbGVzXG4gICAgICAgIHByb2ZpbGVzID0gdGhpcy5wcm9maWxlcyhmaWx0ZXIuZnJvbUZpbGUpO1xuICAgICAgICAvLyBBbmQgYWxsIHRoZSBjb250cm9scyB0aGV5IGNvbnRhaW5cbiAgICAgICAgY29udHJvbHMgPSBwcm9maWxlcy5mbGF0TWFwKHByb2ZpbGUgPT4gcHJvZmlsZS5jb250YWlucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBObyBmaWxlIGZpbHRlciA9PiB3ZSBkb24ndCBjYXJlIGFib3V0IHByb2ZpbGUuIEp1bXAgZGlyZWN0bHkgdG8gdGhlIGZ1bGwgY29udHJvbCBsaXN0XG4gICAgICAgIGNvbnRyb2xzID0gdGhpcy5kYXRhU3RvcmUuY29udGV4dHVhbENvbnRyb2xzO1xuICAgICAgfVxuXG4gICAgICAvLyBGaWx0ZXIgYnkgY29udHJvbCBpZFxuICAgICAgaWYgKGZpbHRlci5jb250cm9sX2lkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29udHJvbHMgPSBjb250cm9scy5maWx0ZXIoYyA9PiBjLmRhdGEuaWQgPT09IGZpbHRlci5jb250cm9sX2lkKTtcbiAgICAgIH1cblxuICAgICAgLy8gRmlsdGVyIGJ5IHN0YXR1cywgaWYgbmVjZXNzYXJ5XG4gICAgICBpZiAoZmlsdGVyLnN0YXR1cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnRyb2xzID0gY29udHJvbHMuZmlsdGVyKFxuICAgICAgICAgIGNvbnRyb2wgPT4gY29udHJvbC5yb290LmhkZi5zdGF0dXMgPT09IGZpbHRlci5zdGF0dXNcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLy8gRmlsdGVyIGJ5IHNldmVyaXR5LCBpZiBuZWNlc3NhcnlcbiAgICAgIGlmIChmaWx0ZXIuc2V2ZXJpdHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb250cm9scyA9IGNvbnRyb2xzLmZpbHRlcihcbiAgICAgICAgICBjb250cm9sID0+IGNvbnRyb2wucm9vdC5oZGYuc2V2ZXJpdHkgPT09IGZpbHRlci5zZXZlcml0eVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyBGaWx0ZXIgYnkgb3ZlcmxheVxuICAgICAgaWYgKGZpbHRlci5vbWl0X292ZXJsYXllZF9jb250cm9scykge1xuICAgICAgICBjb250cm9scyA9IGNvbnRyb2xzLmZpbHRlcihjb250cm9sID0+IGNvbnRyb2wuZXh0ZW5kZWRfYnkubGVuZ3RoID09PSAwKTtcbiAgICAgIH1cblxuICAgICAgLy8gRmlsdGVyIGJ5IHNlYXJjaCB0ZXJtXG4gICAgICBpZiAoZmlsdGVyLnNlYXJjaF90ZXJtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IHRlcm0gPSBmaWx0ZXIuc2VhcmNoX3Rlcm0udG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAvLyBGaWx0ZXIgY29udHJvbHMgdG8gdGhvc2UgdGhhdCBjb250YWluIHNlYXJjaCB0ZXJtXG4gICAgICAgIGNvbnRyb2xzID0gY29udHJvbHMuZmlsdGVyKGMgPT4gY29udGFpbnNfdGVybShjLCB0ZXJtKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZpbHRlciBieSBuaXN0IHN0dWZmXG4gICAgICBpZiAoZmlsdGVyLnRyZWVfZmlsdGVycyAmJiBmaWx0ZXIudHJlZV9maWx0ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gU2hvcnRoYW5kIHRoZSBuaXN0IGZpbHRlcnNcbiAgICAgICAgbGV0IGYgPSBmaWx0ZXIudHJlZV9maWx0ZXJzO1xuXG4gICAgICAgIC8vIENvbnN0cnVjdCBhIG5pc3QgY29udHJvbCB0byByZXByZXNlbnQgdGhlIGZpbHRlclxuICAgICAgICBsZXQgY29udHJvbCA9IG5ldyBuaXN0Lk5pc3RDb250cm9sKGZpbHRlci50cmVlX2ZpbHRlcnMpO1xuXG4gICAgICAgIGNvbnRyb2xzID0gY29udHJvbHMuZmlsdGVyKGMgPT4ge1xuICAgICAgICAgIC8vIEdldCBhbiBoZGYgdmVyc2lvbiBzbyB3ZSBoYXZlIHRoZSBmaXhlZCBuaXN0IHRhZ3NcbiAgICAgICAgICByZXR1cm4gYy5yb290LmhkZi5wYXJzZWRfbmlzdF90YWdzLnNvbWUodCA9PiBjb250cm9sLmNvbnRhaW5zKHQpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZyZWV6ZSBhbmQgc2F2ZSB0byBjYWNoZVxuICAgICAgbGV0IHIgPSBPYmplY3QuZnJlZXplKGNvbnRyb2xzKTtcbiAgICAgIGxvY2FsQ2FjaGUuc2V0KGlkLCByKTtcbiAgICAgIHJldHVybiByO1xuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRmlsdGVyZWREYXRhTW9kdWxlO1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHVuaXF1ZSBzdHJpbmcgdG8gcmVwcmVzZW50IGEgZmlsdGVyLlxuICogRG9lcyBzb21lIG1pbm9yIFwiYWNjZWxlcmF0aW9uXCIgdGVjaG5pcXVlcyBzdWNoIGFzXG4gKiAtIGFubmloaWxhdGluZyBlbXB0eSBzZWFyY2ggdGVybXNcbiAqIC0gZGVmYXVsdGluZyBcIm9taXRfb3ZlcmxheWVkX2NvbnRyb2xzXCJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlcl9jYWNoZV9rZXkoZjogRmlsdGVyKSB7XG4gIC8vIGZpeCB0aGUgc2VhcmNoIHRlcm1cbiAgbGV0IG5ld19zZWFyY2g6IHN0cmluZztcbiAgaWYgKGYuc2VhcmNoX3Rlcm0gIT09IHVuZGVmaW5lZCkge1xuICAgIG5ld19zZWFyY2ggPSBmLnNlYXJjaF90ZXJtLnRyaW0oKTtcbiAgfSBlbHNlIHtcbiAgICBuZXdfc2VhcmNoID0gXCJcIjtcbiAgfVxuXG4gIGxldCBuZXdfZjogRmlsdGVyID0ge1xuICAgIHNlYXJjaF90ZXJtOiBuZXdfc2VhcmNoLFxuICAgIG9taXRfb3ZlcmxheWVkX2NvbnRyb2xzOiBmLm9taXRfb3ZlcmxheWVkX2NvbnRyb2xzIHx8IGZhbHNlLFxuICAgIC4uLmZcbiAgfTtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG5ld19mKTtcbn1cbiJdLCJ2ZXJzaW9uIjozfQ==