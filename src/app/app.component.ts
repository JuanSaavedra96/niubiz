import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

declare var VisanetCheckout:any;
declare global {
  interface Window { openForm: any; }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http:HttpClient) { }
  VisanetCheckout: any;
  //openForm:any;

  title = 'niubiz';
  Token_Seguridad:any;
  codigo_Comercio:any = '456879852';
  token_Session:any;
  ngOnInit(): void {
    this.VisanetCheckout = VisanetCheckout;
    console.log('VisanetCheckout  ', VisanetCheckout);
  }
  generar_TokenSeguridad(){
    const options = {
      method: 'GET',
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: 'Basic aW50ZWdyYWNpb25lc0BuaXViaXouY29tLnBlOl83ejNAOGZG'
      }
    };
    
    fetch('https://apitestenv.vnforapps.com/api.security/v1/security', options)
      .then(response =>  response.text())
      .then(response => {
        this.Token_Seguridad = response;
        console.log(response)
      })
      .catch(err => console.error(err));
  }
  
  generar_TokenSession(){
    //const merchantId = '456879852'
    const amount = '100.00'
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: this.Token_Seguridad
      },
      body: JSON.stringify({
        channel: 'web', 
        amount: amount
      })
    };
    
    fetch('https://apisandbox.vnforappstest.com/api.ecommerce/v2/ecommerce/token/session/' + this.codigo_Comercio, options)
      .then(response => response.json())
      .then(response => this.token_Session = response.sessionKey)
      .catch(err => console.error(err));
  }

  
  openForm() {
    console.log("entró")
    VisanetCheckout.configure({
      sessiontoken:this.token_Session,
      channel:'web',
      merchantid:this.codigo_Comercio,
      purchasenumber:'2020100901',
      amount:'10.5',
      expirationminutes:'20',
      timeouturl:'about:blank',
      merchantlogo:'img/comercio.png',
      formbuttoncolor:'#000000',
      action:'paginaRespuesta',
      complete: function(params:any) {
        alert(JSON.stringify(params));
      }
    });
    VisanetCheckout.open();
  }

  paginaRespuesta(){
    //console.log()
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: this.Token_Seguridad
      },
      body: JSON.stringify({
        "channel": "web",
        "captureType": "manual",
        "countable": true,
        "order" : {
        "tokenId": "99E9BF92C69A4799A9BF92C69AF79979",
        "purchaseNumber": "2020100901",
        "amount": 10.5,
        "currency": "PEN"
        }
      })
    };
    
    this.http.post<any>('https://apisandbox.vnforappstest.com/api.authorization/v3/authorization/ecommerce/'+this.codigo_Comercio,options).subscribe(data=>{
      console.log(data)
    })


    
    /* fetch('https://apisandbox.vnforappstest.com/api.authorization/v3/authorization/ecommerce/' + this.codigo_Comercio, options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err)); */
  }
}

