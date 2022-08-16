(function() {
  // VARS
  const contenedorProductos = document.querySelector("#grid");
  const contenedorCarrito = document.querySelector("#shopping-cart");
  const contenidoCarrito= document.querySelector("#cart-content");
  const toggleCartBtn = document.querySelector("#toggle-cart-btn");
  const clearCartBtn = document.querySelector("#clear-cart");
  const checkoutBtn = document.querySelector("#checkout-btn");
  const totalPriceContainer = document.querySelector("#total-price");

  // FUNCTIONS

  function toggleCart() {

    contenedorCarrito.classList.toggle("open");
  }

  


  function getLSContenido() {

    const lsContenido = JSON.parse(localStorage.getItem("productos")) || [];
    return lsContenido;
  }

  function setLSContenido(lsContenido) {
    
    localStorage.setItem("productos", JSON.stringify(lsContenido));
  }


  function calcularTotal(precios) {

    return precios.reduce(function(prev, next) {
      return prev + next;
    }, 0);
  }

  function getCartItemPrecios() {
  
    const precios = [];
  
    let nums = contenidoCarrito.querySelectorAll("tr td:nth-child(3)");

    if (nums.length > 0) {
      for (let cell = 0; cell < nums.length; cell++) {
        let num = nums[cell].innerText;
        num = num.replace(/[^\d]/g, "");
        num = parseFloat(num);
        precios.push(num);
      }
 
      return precios;
    } else {
      return;
    }
  }

  function displayCarCantidad() {

    const lsContenido = getLSContenido();
    let productMarkup = "";
  
  if (lsContenido !== null || lsContenido !== 0) {  
        const cantidad = lsContenido.length;           
        productMarkup = `Carrito ${cantidad}` ;    
  }
    else {
   
      productMarkup = "Carrito";
    }
  
    toggleCartBtn.innerHTML = productMarkup;
  }

  function displayCartTotal() {
    const precios = getCartItemPrecios();
    let total = 0;
    if (precios) {
      total = calcularTotal(precios);
      totalPriceContainer.innerHTML = `<span class="total">Total: ${total.toFixed(        
      )}</span>`;
    } else {
      totalPriceContainer.innerHTML = '<span class="total">Total: $0</span>';
    }
  }

  function displayProductos() { 
    const lsContenido = getLSContenido();
    let productMarkup = "";

    if (lsContenido !== null) {
      for (let producto of lsContenido) {
        productMarkup += `
          <tr>
          <td><img class="cart-image" src="${producto.foto}" alt="${
          producto.nombre
        }" width="120"></td>
          <td>
            ${producto.nombre}
          </td>
          <td>${producto.precio}</td>        
          <td><a href="#" data-id="${producto.id}" class="remove">X</a></td>
          </tr>
        `;
      }
    } else {
  
      productMarkup = "El carrito está vacío.";
    }

    contenidoCarrito.querySelector("tbody").innerHTML = productMarkup;
    displayCarCantidad();
  }

  function guardarProducto(clickedBtn) {
    const productId = clickedBtn.getAttribute("data-id");
    const card = clickedBtn.parentElement.parentElement;
    const cardInfo = clickedBtn.parentElement;
    const prodFoto = card.querySelector("img").src;
    const prodNombre = cardInfo.querySelector("h4").textContent;
    const prodPrecio = cardInfo.querySelector(".card__price").textContent;      
    const lsContenido =  getLSContenido();
    
    lsContenido.push({
      id: productId,
      foto: prodFoto,
      nombre: prodNombre,
      precio: prodPrecio
      
    });

      setLSContenido(lsContenido);
      displayProductos();
      displayCarCantidad();
    
  }
  


  function borrarProducto(productId) {
    const lsContenido = getLSContenido();
    let productIndex;
    lsContenido.forEach(function(producto, i) {
      if (producto.id === productId) {
        productIndex = i;
      }
    });

    lsContenido.splice(productIndex, 1);

    setLSContenido(lsContenido);
    displayCarCantidad();
    displayProductos();
  }

  function limpiarCarrito() {
    const lsContenido = getLSContenido();
    lsContenido.splice(0, lsContenido.length);
   
    setLSContenido(lsContenido);

    displayProductos();
    displayCarCantidad();

  }

  function checkout() { 
    Swal.fire({
      title: 'La encargamos?',
      text: "Sigamos entonces!!!!!",
      icon: 'sucess',
      showCancelButton: true,
      confirmButtonColor: '#f53aeb',
      cancelButtonColor: '#f53aeb',
      confirmButtonText: 'Si, adelante!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Hacemos unos pasos más!',
          'La/s tortas son tuyas.',
          'Hasta la próxima'
          )
          limpiarCarrito();
          displayCartTotal();
        }
        else
        {
          return;
        }
      });
    }


//CARGAR PAGINA
  document.addEventListener("DOMContentLoaded", function(e) {

    displayProductos(); 
    displayCartTotal();
    cotizacionDolar() ;
  });

 
  toggleCartBtn.addEventListener("click", function(e) {
    e.preventDefault();
    toggleCart();
  });

  
  contenedorProductos.addEventListener("click", function(e) {
    if (e.target.classList.contains("add-to-cart")) {
      e.preventDefault();
      const clickedBtn = e.target;
      guardarProducto(clickedBtn);      
    }
  });

  contenedorProductos.addEventListener("click", function(e) {
    if (e.target.classList.contains("add-to-cart")) {
      displayCartTotal();      
    }
  });

 
  contenidoCarrito.querySelector("tbody").addEventListener("click", function(e) {
    e.preventDefault();
  
    const clickedBtn = e.target;
   
    if (e.target.classList.contains("remove")) {
   
      const productId = clickedBtn.getAttribute("data-id");
    
      borrarProducto(productId);    
      displayCartTotal();
      displayCarCantidad();
    }
  });

 
  clearCartBtn.addEventListener("click", function(e) {
    e.preventDefault();
    limpiarCarrito();   
  });
  clearCartBtn.addEventListener("click", displayCartTotal);


  checkoutBtn.addEventListener("click", function(e) {
    e.preventDefault();
    checkout();
  });
  checkoutBtn.addEventListener("click", displayCartTotal);
})();