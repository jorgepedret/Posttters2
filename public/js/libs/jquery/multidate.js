/*!
 * jQuery Multidate Plugin
 * http://www.beansandcurry.com/
 *
 * Copyright 2012, Beans & Curry
 * Released under the MIT License
 */

(function ($) {
  $.fn.multidate = function (options) {
    var settings = $.extend({
        debug: false,
      }, options),
      id = 0,
      count = 0;


    return this.each(function () {
      var $this = $(this),
        thisId = id++,
        fieldId = 0,
        dates = {},
        hiddenData = $('<input />')
          .attr('type', settings.debug?'text':'hidden')
          .attr('name', $this.attr('name'))
          .attr('id', $this.attr('id'))
          .val($this.val()),
        wrapper = $('<div></div>')
          .addClass('bnc-multidate-wrap')
          .attr('id', 'bnc-multidate-' + thisId),
        $wrapper;


      function prePopulate() {
        if (hiddenData.val() === "") {
          addField();
        } else {
          var saved_dates = hiddenData.val(),
            json_dates = $.parseJSON(saved_dates);
          
          dates = json_dates;
          hiddenData.val(JSON.stringify(dates));
          if (json_dates) {
            $.each(json_dates, function (i, val) {
              addField(i, val.from, val.to);
            });
          }
        }
      }

      function updateDates(passedFieldId, fromOrTo, date) {
        if (!dates[passedFieldId]) {
          dates[passedFieldId] = {};
        }
        dates[passedFieldId][fromOrTo] = date;
        hiddenData.val(JSON.stringify(dates));
      }

      function removeField(id) {
        if (dates[id]) {
          delete dates[id];
          hiddenData.val(JSON.stringify(dates));
        }
        $('#bnc-multidate-' + thisId).find('#bnc-multidate-field-' + id).remove();
        count--;
        if (count <= 0) {
          addField();
        }
      }

      function addField(savedId, dateFrom, dateTo) {
        var thisFieldId = typeof savedId!=='undefined'?savedId:fieldId,
          fieldWrap = $('<div />').addClass('bnc-multidate-field').attr('id', 'bnc-multidate-field-' + thisFieldId),
          labelFrom = $('<label>From:</label>').attr('for', 'bnc-multidate-date-input-from-' + thisFieldId),
          dateFromInput = $('<input />')
            .attr('id', 'bnc-multidate-date-input-from-' + thisFieldId)
            .addClass('bnc-multidate-date-input-from')
            .attr('type', 'text'),
          labelTo = $('<label>To:</label>').attr('for', 'bnc-multidate-date-input-to-' + thisFieldId),
          dateToInput = $('<input />')
            .attr('id', 'bnc-multidate-date-input-to-' + thisFieldId)
            .addClass('bnc-multidate-date-input-to')
            .attr('type', 'text'),
          addField = $('<a>-</a>').addClass('bnc-multidate-remove').data('fieldId', thisFieldId),
          removeField = $('<a>+</a>').addClass('bnc-multidate-add').data('fieldId', thisFieldId);

        fieldWrap
          .append(labelFrom, dateFromInput, labelTo, dateToInput, addField, removeField);

        if (jQuery.ui.datepicker) {
          fieldWrap.find('.bnc-multidate-date-input-from').datetimepicker({
            currentText: "Now",
            showButtonPanel: true,
            dateFormat: "yy-mm-dd",
            timeFormat: "hh:mm tt",
            separator: " @ ",
            hour: 0,
            minute: 0,
            ampm: true,
            defaultDate: new Date(),
            onSelect: function (dateText, inst) {
              updateDates(thisFieldId, 'from', dateText);
            }
          });
          if (typeof dateFrom !== 'undefined') {
            fieldWrap.find('.bnc-multidate-date-input-from').datetimepicker("setDate", new Date(dateFrom));
          }
          
          fieldWrap.find('.bnc-multidate-date-input-to').datetimepicker({
            currentText: "Now",
            showButtonPanel: true,
            dateFormat: "yy-mm-dd",
            timeFormat: "hh:mm tt",
            separator: " @ ",
            hour: 0,
            minute: 0,
            ampm: true,
            defaultDate: new Date(),
            onSelect: function (dateText, inst) {
              updateDates(thisFieldId, 'to', dateText);
            }
          });
          if (typeof dateTo !== 'undefined') {
            fieldWrap.find('.bnc-multidate-date-input-to').datetimepicker("setDate", new Date(dateTo));
          }
        }
        wrapper.append(fieldWrap);
        
        count++;
        fieldId++;
      }

      if (settings.debug) {
        hiddenData.addClass('bnc-multidate-debug');
      }

      // Replace the original field with a hidden field
      $this.replaceWith(hiddenData);
      
      // Wrap the data field with the widget wrapper
      hiddenData.before(wrapper);

      // Initialize the widget
      prePopulate();

      $('.bnc-multidate-add').live("click", function (e) {
        e.preventDefault();
        addField();
      });
      $('.bnc-multidate-remove').live("click", function (e) {
        var itemId = $(this).data('fieldId');
        e.preventDefault();
        removeField(itemId);
      });
    });
  };
})(jQuery);