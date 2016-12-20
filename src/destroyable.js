export class Destroyable {
    destroy() {
        // set properties to null to break references
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
              delete this[prop];
            }
        }
    }
}