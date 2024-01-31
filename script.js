const do_dict = {0:0,10:8,20:13,30:20,40:30,50:43,60:56,70:77,80:88,85:92,90:95,95:97.5,100:99,105:98,110:95,120:90,130:85,140:78,141:50};
const bod5_dict = {0:96,1:92,2:80,2.5:73,3:66,4:58,5:55,7.5:44,8:40,10:33,12.5:26,15:20,17.5:16,20:14,22.5:10,25:8,27.5:6,30:5,31:2};
const nitrate_dict = {0:98,0.25:97,0.5:96,0.75:95,1:94,1.5:92,2:90,3:85,4:70,5:65,10:51,15:43,20:37,30:24,40:17,50:7,60:5,70:4,80:3,90:2,100:1,101:0}
const fecalColiform_dict = {0:100,1:98,2:89,5:80,10:71,20:63,50:53,100:45,200:37,500:27,1000:22,2000:18,5000:13,10000:10,20000:8,50000:5,100000:3,100001:2}
const ph_dict = {0:0,1:0,2:2,3:4,4:8,5:24,6:55,7:90,7.2:92,7.5:93,7.7:90,8:82,8.5:67,9:47,10:19,11:7,12:2,13:0}
const totalPhosphate_dict = {0:99,0.05:98,0.1:97,0.2:95,0.3:90,0.4:78,0.5:60,0.75:50,1:39,1.5:30,2:26,3:21,4:16,5:12,6:10,7:8,8:7,9:6,10:5,11:2}
const temp_dict = {0:93,1:89,2.5:85,5:72,7.5:57,10:44,12.5:36,15:28,17.5:23,20:21,22.5:18,25:15,27.5:12,30:10,31:0}
const totalSolids_dict = {0:80,50:87,100:83.5,150:80,200:73,250:67,300:60,350:52,400:47,450:40,500:33,501:0} 
const turbidity_dict = {0:97,5:84,10:76,15:68,20:62,25:57,30:53,35:48,40:45,50:39,60:34,70:28,80:25,90:22,100:17,101:5}

function interpolate(x, dict) {
    const xValues = Object.keys(dict).map(Number);
    const yValues = Object.values(dict);

    if (x >= Math.max(...xValues)) {
        return yValues[yValues.length - 1];
    }

    if (x <= Math.min(...xValues)) {
        return yValues[0];
    }

    let x1 = xValues.reduce((prev, curr) => (curr <= x ? Math.max(prev, curr) : prev), -Infinity);
    let x2 = xValues.reduce((prev, curr) => (curr >= x ? Math.min(prev, curr) : prev), Infinity);

    //These lines find the closest keys in the dictionary that are less than or equal to (x1) 
    //and greater than or equal to (x2) the input x. The reduce method is used to iterate through all xValues.

    
    let y1 = dict[x1];
    let y2 = dict[x2];

    if (x1 === x2) {
        return y1;
    }

    let interpolatedY = y1 + (x - x1) * (y2 - y1) / (x2 - x1);
    return interpolatedY;
}



document.getElementById('wqiForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevents the form from submitting in the traditional way

    // Retrieving values from the input fields and storing them in variables
    var dissolvedOxygen = parseFloat(document.getElementById('dissolvedOxygen').value) ;
    var temperature = parseFloat(document.getElementById('temperature').value) ;
    var fecalColiform = parseFloat(document.getElementById('fecalColiform').value) ;
    var ph = parseFloat(document.getElementById('ph').value) ;
    var bod5 = parseFloat(document.getElementById('bod5').value) ;
    var totalPhosphate = parseFloat(document.getElementById('totalPhosphate').value) ;
    var nitrate = parseFloat(document.getElementById('nitrate').value) ;
    var turbidity = parseFloat(document.getElementById('turbidity').value) ;
    var totalSolids = parseFloat(document.getElementById('totalSolids').value) ;
    var tempChange = parseFloat(document.getElementById('tempChange').value) ;

    
    // console.log("dissolvedOxygen - ",dissolvedOxygen);
    // console.log("temperature - ",temperature);
    // console.log("fecalColiform - ",fecalColiform);
    // console.log("ph - ",ph);
    // console.log("bod5 - ",bod5);
    // console.log("totalPhosphate - ",totalPhosphate);
    // console.log("nitrate - ",nitrate);
    // console.log("turbidity - ",turbidity);
    // console.log("totalSolids - ",totalSolids);
    // console.log("tempChange - ",tempChange);

    

    var t=temperature;
    var dos = 14.59 - 0.3955 * t + 0.0072 * t * t - 0.0000619 * Math.pow(t, 3);
    // var dos = 14.59 - 0.3955 * t + 0.0072 * t * t - 0.0000619 * (t ** 3);
    var dom = dissolvedOxygen;

    var sat = (dom / dos) * 100;

    const wi = [0.17, 0.16, 0.11, 0.11, 0.10, 0.10, 0.08, 0.07,0.10];

    let ans=0;
    let real_wt=0;
    var Qsat="";
    var Qfec="";
    var Qph="";
    var Qbod="";
    var Qphos="";
    var Qnit="";
    var Qtur="";
    var Qsoldis="";
    var Qtempchange="";

    // console.log("original - ",real_wt,dissolvedOxygen)

    if (!isNaN(dissolvedOxygen)) {
        ans += wi[0] * interpolate(sat, do_dict);
        real_wt += wi[0];
        Qsat=interpolate(sat, do_dict);
        Qsat=Qsat.toFixed(2);
    }

    // console.log("a-",real_wt)

    if (!isNaN(fecalColiform)) {
        ans += wi[1] * interpolate(fecalColiform, fecalColiform_dict);
        real_wt = real_wt + wi[1];
        Qfec=interpolate(fecalColiform, fecalColiform_dict);
        Qfec=Qfec.toFixed(2);
    }

    // console.log("b-",real_wt)


    if (!isNaN(ph)) {
        ans += wi[2] * interpolate(ph, ph_dict);
        real_wt = real_wt + wi[2];
        Qph=interpolate(ph, ph_dict);
        Qph=Qph.toFixed(2);
    }

    // console.log("c-",real_wt)


    if (!isNaN(bod5)) {
        ans += wi[3] * interpolate(bod5, bod5_dict);
        real_wt = real_wt + wi[3];
        Qbod=interpolate(bod5, bod5_dict);
        Qbod=Qbod.toFixed(2);
    }

    // console.log("d-",real_wt)

    if (!isNaN(totalPhosphate)) {
        ans += wi[4] * interpolate(totalPhosphate, totalPhosphate_dict);
        real_wt = real_wt + wi[4];
        Qphos=interpolate(totalPhosphate, totalPhosphate_dict);
        Qphos=Qphos.toFixed(2);
    }

    // console.log("e-",real_wt)


    if (!isNaN(nitrate)) {
        ans += wi[5] * interpolate(nitrate, nitrate_dict);
        real_wt = real_wt + wi[5];
        Qnit=interpolate(nitrate, nitrate_dict);
        Qnit=Qnit.toFixed(2);
    }

    // console.log("f-",real_wt)


    if (!isNaN(turbidity)) {
        ans += wi[6] * interpolate(turbidity, turbidity_dict);
        real_wt = real_wt + wi[6];
        Qtur=interpolate(turbidity, turbidity_dict);
        Qtur=Qtur.toFixed(2);
    }

    // console.log("g-",real_wt)


    if (!isNaN(totalSolids)) {
        ans += wi[7] * interpolate(totalSolids, totalSolids_dict);
        real_wt = real_wt + wi[7];
        Qsoldis=interpolate(totalSolids, totalSolids_dict);
        Qsoldis=Qsoldis.toFixed(2);
    }

    // console.log("h-",real_wt)


    if (!isNaN(tempChange)) {
        ans += wi[8] * interpolate(tempChange, temp_dict);
        real_wt = real_wt + wi[8];
        Qtempchange=interpolate(tempChange, temp_dict);
        Qtempchange=Qtempchange.toFixed(2);
    }

    // console.log("i-",real_wt)



    if (real_wt === 0) {
        real_wt = 1;
    }


    console.log("last ka weight-",real_wt)


    ans/=real_wt;


    var wqi = ans;
    var waterQualityRating = "";

    if (wqi >= 0 && wqi < 25) {
        waterQualityRating = "Very Bad";
    } else if (wqi >= 25 && wqi < 50) {
        waterQualityRating = "Bad";
    } else if (wqi >= 50 && wqi < 70) {
        waterQualityRating = "Medium";
    } else if (wqi >= 70 && wqi < 90) {
        waterQualityRating = "Good";
    } else if (wqi >= 90 && wqi <= 100) {
        waterQualityRating = "Excellent";
    } else {
        waterQualityRating = "Invalid"; // In case the WQI is out of expected bounds
    }

    // Display the results in the 'result' div
    // document.getElementById('result').innerHTML = `
    //     <p>Water Quality Index (WQI): ${wqi.toFixed(2)}</p>
    //     <p>Water Quality Rating: ${waterQualityRating}</p>
    //     <p>DO Saturation: ${dos.toFixed(2)}</p>
    //     <p>WT: ${real_wt.toFixed(2)}</p>
    //     <p>QSat: ${Qsat}</p>

    // `;


//     document.getElementById('result').innerHTML = `
//     <table>
//         <tr>
//             <td>Water Quality Index (WQI):</td>
//             <td>${wqi.toFixed(2)}</td>
//         </tr>
//         <tr>
//             <td>Water Quality Rating:</td>
//             <td>${waterQualityRating}</td>
//         </tr>
//         <tr>
//             <td>DO Saturation:</td>
//             <td>${dos.toFixed(2)}</td>
//         </tr>
//         <tr>
//             <td>WT:</td>
//             <td>${real_wt.toFixed(2)}</td>
//         </tr>
//         <tr>
//             <td>QSat:</td>
//             <td>${Qsat}</td>
//         </tr>
//         <!-- Add similar rows for other parameters -->
//     </table>
// `;


// Popup creation
var popup = document.createElement('div');
popup.id = 'resultPopup';
popup.className = 'popup';
popup.innerHTML = `
    <div class="popup-content">
        <span class="close">&times;</span>
        <table>
            <!-- Your table rows here -->
            <tr><td>Water Quality Index (WQI):</td><td>${wqi.toFixed(2)}</td></tr>
            <tr><td>Water Quality Rating:</td><td>${waterQualityRating}</td></tr>
            <tr><td>DO Saturation:</td><td>${dos.toFixed(2)}</td></tr>
            <tr><td>Weight (W):</td><td>${real_wt.toFixed(2)}</td></tr>
            <tr><td>Q Value for DO(% Saturation):</td><td>${Qsat}</td></tr>
            <tr><td>Q Value for BOD5:</td><td>${Qbod}</td></tr>
            <tr><td>Q Value for Nitrate and Nitrite:</td><td>${Qnit}</td></tr>
            <tr><td>Q Value for Fecal Coliform:</td><td>${Qfec}</td></tr>
            <tr><td>Q Value for pH:</td><td>${Qph}</td></tr>
            <tr><td>Q Value for Total Phosphate:</td><td>${Qphos}</td></tr>
            <tr><td>Q Value for Temperature Change:</td><td>${Qtempchange}</td></tr>
            <tr><td>Q Value for Total Solids:</td><td>${Qsoldis}</td></tr>
            <tr><td>Q Value for Turbidity:</td><td>${Qtur}</td></tr>
            
        </table>
    </div>
`;

document.body.appendChild(popup);

// Close button functionality
var close = document.getElementsByClassName("close")[0];
close.onclick = function() {
    popup.style.display = "none";
    document.body.removeChild(popup);
}

window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none";
        document.body.removeChild(popup);
    }
}

e.preventDefault();

});

