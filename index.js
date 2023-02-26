        // https://apicities.onrender.com/LBcities
        // http://localhost:3030/users
        fetch('https://lbcities-api.onrender.com/LBcities')
            .then(response => response.json())
            .then(json => {
                console.log(json)
                var citiesdup = json.map(city => city.District);
                var citiesnodup = citiesdup.filter((item, index) => citiesdup.indexOf(item) == index).sort();

                json.forEach(cities => {
                    var option = document.createElement('option');
                    option.innerHTML = cities.Location_Name_En;
                    option.value = cities.Pcode;
                    document.getElementById('select').appendChild(option);
                });

                citiesnodup.forEach(element => {
                    var option = document.createElement('option');
                    option.innerHTML = element;
                    option.value = element;
                    document.getElementById('filter').appendChild(option);
                });

                displayTable();
            })

        function displayTable() {
            document.getElementById('tr').innerHTML = '';
            document.getElementById('tr2').innerHTML = '';
            document.getElementById('tr3').innerHTML = '';
            document.getElementById('city').innerHTML = '';
            document.getElementById('location').innerHTML = '';

            var id = document.getElementById('select').value;
            fetch('https://lbcities-api.onrender.com/LBcities')
                .then(response => response.json())
                .then(json => {
                    var data = json.filter(city => city.Pcode == id);

                    var span = document.createElement('span');
                    var loc = ` <a href="${data[0].Google_Map_link}">${data[0].Google_Map_link}</a>`
                    span.innerHTML = loc;
                    document.getElementById('location').appendChild(span);


                    document.getElementById('city').innerHTML = data[0].Location_Name_En;

                    var td1 = document.createElement('td');
                    td1.innerHTML = data[0].Pcode;
                    document.getElementById('tr').appendChild(td1);

                    var td3 = document.createElement('td');
                    td3.innerHTML = data[0].Governorate;
                    document.getElementById('tr').appendChild(td3);

                    var td4 = document.createElement('td');
                    td4.innerHTML = data[0].District;
                    document.getElementById('tr').appendChild(td4);

                    var td5 = document.createElement('td');
                    td5.innerHTML = JSON.parse(data[0].Latitude).toFixed(3) + " & " + JSON.parse(data[0].Longitude).toFixed(3);
                    document.getElementById('tr').appendChild(td5);

                    var lanlon = 'latitude=' + data[0].Latitude + '&longitude=' + data[0].Longitude;

                    fetch(`https://api.open-meteo.com/v1/forecast?${lanlon}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`)
                        .then(response => response.json())
                        .then(json => {
                            console.log(json)

                            const now = new Date();
                            const hours = now.getHours();
                            const dayOfMonth = now.getDate();
                            const monthIndex = now.getMonth();
                            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                            const year = now.getFullYear();
                            var currenttimeanddata = `${year}-0${monthIndex + 1}-${dayOfMonth}T${hours}:00`
                            console.log(`Current Time & Date: ${currenttimeanddata}`)

                            const timedata = json.hourly.time;

                            for (let i = 0; i < timedata.length; i++) {
                                if (timedata[i] === currenttimeanddata) {
                                    var index = i;

                                    break;
                                }
                            }
                            console.log(`Current Time object index: ${index}`)

                            var td7 = document.createElement('td');
                            td7.innerHTML = json.timezone + ' ' + json.hourly.time[index];
                            document.getElementById('tr2').appendChild(td7);

                            var td8 = document.createElement('td');
                            td8.innerHTML = json.hourly.temperature_2m[index] + ' °C';
                            document.getElementById('tr2').appendChild(td8);

                            var td9 = document.createElement('td');
                            td9.innerHTML = json.hourly.windspeed_10m[index] + ' km/h';
                            document.getElementById('tr2').appendChild(td9);
                            //------------------------------------------------------------
                            var td10 = document.createElement('td');
                            td10.innerHTML = json.timezone + ' ' + json.hourly.time[index+24];
                            document.getElementById('tr3').appendChild(td10);

                            var td11 = document.createElement('td');
                            td11.innerHTML = json.hourly.temperature_2m[index+24] + ' °C';
                            document.getElementById('tr3').appendChild(td11);

                            var td12 = document.createElement('td');
                            td12.innerHTML = json.hourly.windspeed_10m[index+24] + ' km/h';
                            document.getElementById('tr3').appendChild(td12);
                        })

                })
        }

        function filter() {
            var district = document.getElementById('filter').value
            document.getElementById('select').innerHTML = '';
            fetch('https://lbcities-api.onrender.com/LBcities')
                .then(response => response.json())
                .then(json => {
                    if (district == 'all') {
                        json.forEach(cities => {
                            var option = document.createElement('option');
                            option.innerHTML = cities.Location_Name_En;
                            option.value = cities.Pcode;
                            document.getElementById('select').appendChild(option);
                        });
                        displayTable();
                    } else {
                        var cities = json.filter(c => c.District == district);
                        cities.forEach(city => {
                            var option = document.createElement('option');
                            option.innerHTML = city.Location_Name_En;
                            option.value = city.Pcode;
                            document.getElementById('select').appendChild(option);
                        });
                        displayTable();
                    }
                })
        }

        function listusers() {
            document.getElementById('users_list').innerHTML = "";
            fetch('https://usersinfoapi2.onrender.com/users')
                .then(samir => samir.json())
                .then(samir2 => {
                    samir2.forEach(element => {
                        var li = document.createElement('list');
                        li.classList.add('list-group-item');
                        li.innerHTML =  element.name + "</br>";
                        document.getElementById('users_list').appendChild(li);
                    });
                })
        }
        listusers(); // list Users in the "users_list"


        function clearfealds() {
            document.getElementById('textname').value = "";
            document.getElementById('textphone').value = "";
        }



        function adduser() {

            var namevalue = document.getElementById('textname').value;
            var phonevalue = document.getElementById('textphone').value;

            fetch('https://usersinfoapi2.onrender.com/adduser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'name': namevalue, 'phone': phonevalue }),
            }).then(res => res.json())
                .then(res => console.log(res))
                .then(listusers())
                .then(clearfealds())


        }