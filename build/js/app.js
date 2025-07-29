// Slider
var swiper = new Swiper(".swiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  initialSlide: 3,
  speed: 600,
  preventClicks: true,
  slidesPerView: "auto",
  loop: true,
  coverflowEffect: {
    rotate: 0,
    stretch: 80,
    depth: 500,
    modifier: 1,
    slideShadows: true
  },
  on: {
    click(event){
      swiper.slideTo(this.clickedIndex);
    }
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
});

//Menu mobile
const btnMobileBars = document.querySelector("#btnMobileBars");
const menuOffCanvasClose = document.querySelector("#menuOffCanvas-close");

btnMobileBars.addEventListener("click", e => {
  e.preventDefault();
  document.querySelector("#menuOffCanvas").classList.toggle("menuOffCanvas-hidden");
})

menuOffCanvasClose.addEventListener("click", e => {
  e.preventDefault();
  document.querySelector("#menuOffCanvas").classList.toggle("menuOffCanvas-hidden");
})

/** Codigo Modal */
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('myModal');
  const openModalBtn = document.getElementById('openModalBtn');
  const closeButton = document.querySelector('.close-button');
  const modalContent = document.querySelector('.modal-content');
  const formEncuesta = document.querySelector("#formEncuesta");
  const messageDiv = document.getElementById('message'); // El div para mostrar mensajes

  openModalBtn.addEventListener('click', function() {
      modal.style.display = 'flex';
      modalContent.classList.remove('bounce-out');
  });

  function closeModal() {
      modalContent.classList.add('bounce-out');
      modalContent.addEventListener('animationend', function handler(e) {
          if (e.animationName === 'bounceOut') {
              modal.style.display = 'none';
              modalContent.classList.remove('bounce-out');
              modalContent.removeEventListener('animationend', handler);
          }
      });
  }

  function showMessage(msg, type) {
      messageDiv.textContent = msg;
      messageDiv.className = 'message-box'; // Resetear clases
      messageDiv.classList.add(type); // Añadir 'success' o 'error'
      messageDiv.style.display = 'block'; // Mostrar el div

      setTimeout(() => {
          hideMessage();
      }, 5000); // Ocultar después de 5 segundos
  }

  function hideMessage() {
      messageDiv.style.display = 'none';
      messageDiv.textContent = '';
      messageDiv.className = 'message-box'; // Limpiar clases de tipo
  }

  formEncuesta.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(formEncuesta);
    const data = {};

    for (const [key, value] of formData.entries()) {
        if (data[key] === undefined) {
             data[key] = value;
        } else if (formEncuesta.elements[key] && formEncuesta.elements[key].length > 1 && formEncuesta.elements[key][0].type === 'radio') {
            if (value !== '') {
                data[key] = value;
            }
        } else {
             data[key] = value;
        }
    }

    if (data.ocupacion !== 'Otra' && data.otra_ocupacion !== undefined) {
        data.otra_ocupacion = null;
    }
    if (data.ingresos_personales !== 'Otra…' && data.otra_ingreso_personal !== undefined) {
        data.otra_ingreso_personal = data.otra_ingreso_personal.trim() === '' ? null : data.otra_ingreso_personal;
    }
    if (data.ingresos_familiares !== 'Otra…' && data.otra_ingreso_familia !== undefined) {
        data.otra_ingreso_familia = data.otra_ingreso_familia.trim() === '' ? null : data.otra_ingreso_familia;
    }

    for (const key in data) {
        if (data[key] === '') {
            data[key] = null;
        }
    }

    try {
        const response = await axios.post('https://pinos-backend.onrender.com/api/crear', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.err) {
            showMessage(response.data.err, 'error');
            // No cerrar el modal en caso de error
        } else {
            showMessage('¡Formulario enviado exitosamente!', 'success');
            formEncuesta.reset();
            setTimeout(() => { // Cierra el modal después de que el mensaje de éxito desaparece
                closeModal();
            }, 5500); // 5000ms del setTimeout + 500ms extra para asegurar
        }

    } catch (error) {
        let errorMessage = 'Error al enviar el formulario.';
        if (error.response) {
            errorMessage = `Error del servidor: ${error.response.data.message || 'Error desconocido del backend.'}`;
        } else if (error.request) {
            errorMessage = 'No se pudo conectar con el servidor. Asegúrate de que el backend esté funcionando.';
        } else {
            errorMessage = `Error inesperado: ${error.message}`;
        }
        showMessage(errorMessage, 'error');
        // No cerrar el modal en caso de error
    }
  });

  closeButton.addEventListener('click', closeModal);

  window.addEventListener('click', function(event) {
      if (event.target === modal) {
          closeModal();
      }
  });

  document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && modal.style.display === 'flex') {
          closeModal();
      }
  });
});
