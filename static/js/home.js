// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/truths',
                accepts: 'application/json',
                dataType: 'json',
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'create': function(truthtext, hexcode) {
            let ajax_options = {
                type: 'POST',
                url: 'api/truths',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'truthtext': truthtext,
                    'hexcode': hexcode,
                }),
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {                
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'update': function(truthtext, hexcode) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/truths/' + hexcode,
                accepts: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'truthtext': truthtext,
                    'hexcode': hexcode,
                }),
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'delete': function(hexcode) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/truths/' + hexcode,
                accepts: 'application/json',
                contentType: 'plain/text',
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $truthtext = $('#truthtext'),
        $hexcode = $('#hexcode');
    
    // return the API
    return {
        reset: function() {
            $hexcode.val('');
            $truthtext.val('').focus();
        },
        update_editor: function(truthtext, hexcode) {
            $hexcode.val(hexcode);
            $truthtext.val(truthtext).focus();
        },
        build_table: function(truths) {
            let rows = ''

            // clear the table
            $('.truths table > tbody').empty();

            // did we get a truths array?
            if (truths) {
                for (let i=0, l=truths.length; i < l; i++) {
                    rows += `<tr><td class="truthtext">${truths[i].truthtext}</td><td class="hexcode">${truths[i].hexcode}</td><td>${truths[i].timestamp}</td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        },
    };
    
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $truthtext = $('#truthtext'),
        $hexcode = $('#hexcode');
    
    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(truthtext, hexcode) {
        return truthtext !== "" && hexcode !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let truthtext = $truthtext.val(),
            hexcode = $hexcode.val();
        
        e.preventDefault();

        if (validate(truthtext, hexcode)) {
            model.create(truthtext, hexcode);
        } else {
            alert('Problem with truth or hex code input');
        }
    });

    $('#update').click(function(e) {
        let truthtext = $truthtext.val(),
            hexcode = $hexcode.val();

        e.preventDefault();

        if (validate(truthtext, hexcode)) {
            model.update(truthtext, hexcode);
        } else {
            alert('Problem with truth or hex code input');
        }
        e.preventDefault();
    });

    $('#delete').click(function(e) {
        let hexcode = $hexcode.val();

        e.preventDefault();

        if (validate('placeholder', hexcode)) {
            model.delete(hexcode);
        } else {
            alert('Problem with hex code input');
        }
        e.preventDefault();
    });

    $('#reset').click(function() {
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            truthtext,
            hexcode;
        
        truthtext = $target
            .parent()
            .find('td.truthtext')
            .text();
        
        hexcode = $target
            .parent()
            .find('td.hexcode')
            .text();
        
        view.update_editor(truthtext, hexcode);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
        model.read();
    })

    $event_pump.on('model_delete_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        // test

        if (!xhr.responseJSON) {
            var positionOfDetail = xhr.responseText.indexOf("detail");
            var startDetail = positionOfDetail + 10;
            var endDetail = positionOfDetail + 200;
            var detail = xhr.responseText.slice(startDetail, endDetail);
            console.log("detail:", detail);
            console.log("view:", ns.view);
            console.log("view.build_table", ns.view.build_table);
        } else {
            let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
            view.error(error_msg);
            console.log(error_msg);
        };

        // test end
        
        // let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        // view.error(error_msg);
        // console.log(error_msg);
    })
}(ns.model, ns.view));



