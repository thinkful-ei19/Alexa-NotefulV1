/* global $ store api */
'use strict';

const noteful = (function () {

  function render() {

    const notesList = generateNotesList(store.notes, store.currentNote);
    $('.js-notes-list').html(notesList);

    const editForm = $('.js-note-edit-form');
    editForm.find('.js-note-title-entry').val(store.currentNote.title);
    editForm.find('.js-note-content-entry').val(store.currentNote.content);
  }

  /**
   * GENERATE HTML FUNCTIONS
   */
  function generateNotesList(list, currentNote) {
    const listItems = list.map(item => `
    <li data-id="${item.id}" class="js-note-element ${currentNote.id === item.id ? 'active' : ''}">
      <a href="#" class="name js-note-show-link">${item.title}</a>
      <button class="removeBtn js-note-delete-button">X</button>
    </li>`);
    return listItems.join('');
  }

  /**
   * HELPERS
   */
  function getNoteIdFromElement(item) {
    const id = $(item).closest('.js-note-element').data('id');
    return id;
  }

  /**
   * EVENT LISTENERS AND HANDLERS
   */
  function handleNoteItemClick() {
    $('.js-notes-list').on('click', '.js-note-show-link', event => {
      event.preventDefault();

      const noteId = getNoteIdFromElement(event.currentTarget);

      api.details(noteId)
        .then(detailsResponse => {
          store.currentNote = detailsResponse;
          render();
        });
    });
  }

  function handleNoteSearchSubmit() {
    $('.js-notes-search-form').on('submit', event => {
      event.preventDefault();

      const searchTerm = $('.js-note-search-entry').val();
      store.currentSearchTerm = searchTerm ? { searchTerm } : {};

      //Promisified Solution
      // api.search(store.currentSearchTerm)
      //   .then(searchResponse => {
      //     store.notes = searchResponse;
      //     render();
      //   });

      //DRY Solution
      doSearchAndRender();
    });
  }

  function handleNoteFormSubmit() {
    $('.js-note-edit-form').on('submit', function (event) {
      event.preventDefault();

      const editForm = $(event.currentTarget);

      const noteObj = {
        id: store.currentNote.id,
        title: editForm.find('.js-note-title-entry').val(),
        content: editForm.find('.js-note-content-entry').val()
      };

      //checking to see if we are updating note or subiting new note
      if(store.currentNote.id) {

        //Promisified solution
        // api.update(store.currentNote.id, noteObj)
        //   .then(updateResponse => {
        //     store.currentNote = updateResponse;
        //  }).then(doSearchAndRender);
        //     api.search(store.currentSearchTerm)
        //       .then(updateResponse => {
        //         store.notes = updateResponse;
        //         render();
        //       });

        //DRY Solution
        api.update(store.currentNote.id, noteObj)
          .then(updateResponse => {
            store.currentNote = updateResponse;
          })
          .then(doSearchAndRender);

      } else {

        //Promisified Solution
        // api.create(noteObj)
        //   .then(updateResponse => {
        //     store.currentNote = updateResponse;

        //     api.search(store.currentSearchTerm)
        //       .then(updateResponse => {
        //         store.notes = updateResponse;
        //         render();
        //       });
        //   });

        //DRY Solution
        api.create(noteObj)
          .then(createResponse => {
            store.currentNote = createResponse;
          })
          .then(doSearchAndRender);
      }
    });
  }

  function handleNoteStartNewSubmit() {
    $('.js-start-new-note-form').on('submit', event => {
      event.preventDefault();
      store.currentNote = false;
      render();
    });
  }

  function handleNoteDeleteClick() {
    $('.js-notes-list').on('click', '.js-note-delete-button', event => {
      event.preventDefault();

      const noteId = getNoteIdFromElement(event.currentTarget);

      //Promisified Solution
      // api.delete(noteId)
      //   .then(() => api.search(store.currentSearchTerm))
      //   .then(searchResponse => {
      //     store.notes = searchResponse;
      //     if (noteId === store.currentNote.id) {
      //       store.currentNote = {};
      //     }
      //     render();
      //   });

      //DRY Solution
      api.delete(noteId)
        .then(() => {
          if (noteId === store.currentNote.id) {
            store.currentNote = {};
          }
        })
        .then(doSearchAndRender);
    });
  }

  function doSearchAndRender() {
    return  api.search(store.currentSearchTerm)
      .then(searchResponse => {
        store.notes = searchResponse;
        render();
      });
  }

  function bindEventListeners() {
    handleNoteItemClick();
    handleNoteSearchSubmit();
    handleNoteFormSubmit();
    handleNoteStartNewSubmit();
    handleNoteDeleteClick();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
    doSearchAndRender
  };

}());
