$(document).ready(function () {
    // Function to display calendar for those over 18
    $(function () {
        var dtToday = new Date();
        var month = dtToday.getMonth() + 1;
        var day = dtToday.getDate();
        var year = dtToday.getFullYear() - 18;
        if (month < 10)
            month = '0' + month.toString();
        if (day < 10)
            day = '0' + day.toString();
        var minDate = year + '-' + month + '-' + day;
        var maxDate = year + '-' + month + '-' + day;
        $('#validationdob').attr('max', maxDate);
    });

    // Change addres form for living in Colchester or not
    $('#customRadioInline1').click(function () {
        $('#manualaddress').hide();
        $('#autoaddress').show();
    });

    $('#customRadioInline2').click(function () {
        $('#manualaddress').removeClass('d-none');
        $('#autoaddress').hide();
        $('#manualaddress').show();
    });

    // Fetch data from API
    $('#findaddress').click(function (e) {
        e.preventDefault();
        let askedPC = $('#validationpostcode').val();
        let postMatch = new RegExp(/[A-z]{1,2}[0-9]{1,2} [0-9][A-Z]{2}/i);
        let url = 'https://interviewtask.azurewebsites.net/api/address?postcode=';
        let askedURL = url + askedPC.replace(/\s/g, "%20");
        if (postMatch.test(askedPC)) {
            $(function () {
                let $addresses = $('#addresses');
                $.ajax({
                    type: "GET",
                    url: askedURL,
                    success: function (address) {
                        $('#addresses, #addresseslabel').removeClass('d-none');
                        $('#validationpostcode, #findaddress').addClass('d-none');
                        $('#postcodelabel').after('<p class="mr-3 mb-3 d-inline-block">' + address.addresses[0].PostCode + '</p><a class="d-inline-block" href="">Change</a>')
                        $.each(address.addresses, function (i) {
                            String.prototype.uppwords = function () {
                                return this.toLowerCase().replace(/\b[a-z]/g, function (first) {
                                    return first.toUpperCase();
                                });
                            }
                            $addresses.append('<option>' + (address.addresses[i].Name).uppwords() + ', ' + (address.addresses[i].PostCode) + ', ' + (address.addresses[i].Town) + '</option>');
                        });
                    }
                });
            })
        }
        else {
            alert('Please use a UK valid postcode including space in between')
        }
    });

    $('#addresses').change(function (e) {
        e.preventDefault();
        let addressForMap = $('#addresses').val();
        let urlbase1 = 'https://maps.google.com/maps?q=';
        let urlbase2 = '&t=&z=15&ie=UTF8&iwloc=&output=embed';
        let mapurl = urlbase1 + addressForMap.replace(/\s/g, "%20") + urlbase2;
        $('#gmap_canvas').attr('src', mapurl);
        $('#insert-address').html(addressForMap);
    });


    $('#contactForm').validate({
        rules: {
            validationfname: {
                required: true
            },
            validationlname: {
                required: true
            },
            validationemail: {
                required: true,
                email: true
            },
            validationphone: {
                required: true
            },
            validationdob: {
                required: true
            },
            validationpostcode: {
                required: true
            },
            addresses: {
                required: true
            },
            validationAddLineOne: {
                required: true
            },
            validationAddTown: {
                required: true
            },
            validationAddPostCode: {
                required: true
            },
            validationmessage: {
                required: true
            },
        },
        submitHandler: function (form) {
            $("#submitMessage").html("Thanks! Your message has been sent.");
            return false;
        }
    })
});
