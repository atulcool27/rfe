



const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib

async function downloadPDF() {
  // Fetch an existing PDF document
  const url = 'https://racekonindustries.in/pdfperforma.pdf'
      const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes)

  // Embed the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // Get the first page of the document
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]

  // Get the width and height of the first page
  const { width, height } = firstPage.getSize()

  var test = "2-3KG Ac Synchronous motorXXX1XXX560,7-7kg Ac Synchronous MotorXXX4XXX2680,4-10Kg Ac Synchronous motorXXX2XXX1820,";
  //var cartitems = localStorage.getItem("racecart").split(",");
  var cartitems = test.substring(0,test.length-1).split(",");
  var productData = "";
  for(var index=0;index<cartitems.length;index++) {
      var item = cartitems[index];
    productData += item.split("-")[1]+",";
  }


  var productList = productData.substring(0,productData.length-1).split(",");


  //Date 
  firstPage.drawText(""+dateToYMD(new Date()), {
    x: 345,
    y: 691,
    size: 10,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })

   //Company Name
   firstPage.drawText("AK INDUSTRIES PRIVATE LIMITED", {
    x: 40,
    y: 585,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0)
   })

   //Company Address
   firstPage.drawText("NAVI MUMBAI KOLKATA", {
    x: 40,
    y: 570,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0)
   })

   //Phone Number
   firstPage.drawText("MOBILE : 9999179243", {
    x: 40,
    y: 555,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0)
   })

   //GST Number
   firstPage.drawText("GSTIN : 22DHYUO2436D1Z5", {
    x: 40,
    y: 540,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0)
   })


   //GST Number
   firstPage.drawText("STATE          CODE : 17", {
    x: 40,
    y: 525,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0)
   })


   var tempAmount = 0;

   //Print products 10 times
  for(var i =0; i<productList.length;i=i+1){

      //Serial Number
        firstPage.drawText(""+(i+1), {
            x: 45,
            y: 460-15*i,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0)
          })

          //ProductName
        firstPage.drawText(""+productList[i].split("XXX")[0].toUpperCase(), {
            x: 85,
            y: 460-15*i,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0)
          })

           //HSN
        firstPage.drawText("85011020", {
            x: 255,
            y: 460-15*i,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0)
          })

             //Quantity
        firstPage.drawText(""+productList[i].split("XXX")[1], {
            x: 330,
            y: 460-15*i,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0)
          })

               //Rate
        var temp = parseFloat(productList[i].split("XXX")[2])/parseFloat(productList[i].split("XXX")[1]);
        temp = parseInt(temp);
        var spaces = "";
        for (var pos = 0; pos < (6 - temp.toString().length); pos++) {
            spaces += " ";
        }
        firstPage.drawText(""+spaces+parseInt(temp), {
            x: 372,
            y: 460-15*i,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0)
          })

                //NOS
        firstPage.drawText("NOS", {
            x: 430,
            y: 460-15*i,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0)
          })


                  //Amount
      spaces = "";
      temp = Math.round(parseFloat(productList[i].split("XXX")[2]));
      tempAmount+=temp;
      temp = temp.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        currency: 'INR'});
      for (var pos = 0; pos < (10 - temp.toString().length); pos++) {
          spaces += " ";
      }
        firstPage.drawText(""+spaces+temp, {
            x: 520,
            y: 460-15*i,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0)
          })
  }


  var spaces = "";
  var tempAmount1 = tempAmount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    currency: 'INR'});
  for (var pos = 0; pos < (10 - tempAmount1.toString().length); pos++) {
    spaces += " ";
 }
  //Amount Before Discount
  firstPage.drawText(""+spaces+tempAmount1, {
    x: 520,
    y: 308,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })


  
    //Taxable Value
 firstPage.drawText(""+spaces+tempAmount1, {
    x: 372,
    y: 190,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })


    //Taxable Value
 firstPage.drawText(""+spaces+tempAmount1, {
    x: 372,
    y: 176,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })

 
  //Discount
   var gstAmount =  Math.round(tempAmount*18/100);
   var gstAmount1 = gstAmount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    currency: 'INR'});
  spaces="";
  for (var pos = 0; pos < (10 - gstAmount1.toString().length); pos++) {
    spaces += " ";
 }
  firstPage.drawText(""+spaces+gstAmount1, {
    x: 520,
    y: 280,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })


  
    //Total Taxable Value
 firstPage.drawText(""+spaces+gstAmount1, {
    x: 470,
    y: 190,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })


    //Total Taxable value
 firstPage.drawText(""+spaces+gstAmount1, {
    x: 470,
    y: 176,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })


  //Total
  var totalAmount =  tempAmount+gstAmount;
  var totalAmount1 = totalAmount.toLocaleString('en-IN', {
   maximumFractionDigits: 2,
   currency: 'INR'});
 spaces="";
 for (var pos = 0; pos < (10 - totalAmount1.toString().length); pos++) {
   spaces += " ";
}
  firstPage.drawText(""+spaces+totalAmount1, {
    x: 520,
    y: 242,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })

  

 //Total IN ENGLISH
 firstPage.drawText(""+inWords(tempAmount).toUpperCase(), {
    x: 40,
    y: 229,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })


  //Total IN ENGLISH AFTER GST
 firstPage.drawText(""+inWords(totalAmount).toUpperCase(), {
    x: 145,
    y: 164,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })



    //Total Taxable Value
 firstPage.drawText(""+spaces+totalAmount1, {
    x: 520,
    y: 190,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })


    //Total Taxable value
 firstPage.drawText(""+spaces+totalAmount1, {
    x: 520,
    y: 176,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })



  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save()

        // Trigger the browser to download the PDF document
  download(pdfBytes, "porformainvoice.pdf", "application/pdf");
}



var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

function inWords (num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'rupees only ' : '';
    return str;
}





function dateToYMD(date) {
    var strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d = date.getDate();
    var m = strArray[date.getMonth()];
    var y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '-' + m + '-' + y;
}