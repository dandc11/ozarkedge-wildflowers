import {defineMigration, at, set} from 'sanity/migrate'

export default defineMigration({
  title: 'Rename pageBodyPortableText objects',
  documentTypes: ["nativePlant", "about", "season", "plantListPage"],

  migrate: {
    document(document: any) {
      const patches = [];

      Object.keys(document).forEach(key => {
        const value = document[key];
        if (Array.isArray(value)) {
          value.forEach((block: any, index: number) => {
              console.log('block', block.name);
              if (block.name === 'imageCollection') {
                console.log('imageCollection', block);
                patches.push(at([key, index, '_type'], set('')));
              } else if (block.name === 'portTextVideo') {
                console.log('portTextVideo', block);
                patches.push(at([key, index, '_type'], set('portTextVideo')));
                patches.push(at([key, index, 'title'], set('portTextVideo')));
              }
          });
        }
      });

      return patches;
    }
  }
});
