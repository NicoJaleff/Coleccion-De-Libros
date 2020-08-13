//Definicion de las clases//
class Libro{
    constructor(titulo , autor , isbn){
        this.titulo = titulo;
        this.autor = autor;
        this.isbn = isbn;
    }
}

//Front
class UI{
    static mostrarLibros(){
        const libros = Datos.traerLibros();
        libros.forEach((libro) => UI.agregarLibrosLista(libro));
    }

    static agregarLibrosLista(libro){
        const lista = document.querySelector('#libro-list');
        
        const fila = document.createElement('tr');
        fila.innerHTML = `
         <td>${libro.titulo}</td>
         <td>${libro.autor}</td>
         <td>${libro.isbn}</td>
         <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        lista.appendChild(fila);
    }

    static eliminarLibros(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static mostrarAlerta(mensaje , className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(mensaje));

        const container = document.querySelector('.container');
        const form = document.querySelector('#libro-form');
        container.insertBefore(div,form);

        setTimeout(() => document.querySelector('.alert').remove(), 5000);
    }

    static limparLosCampos(){
        document.querySelector('#titulo').value = '';
        document.querySelector('#autor').value = '';
        document.querySelector('#isbn').value = '';
    }
}

//LocalStorage
class Datos{
    static traerLibros(){
        let libros;
        if(localStorage.getItem('libros') === null){
            libros=[];
        }else{
            libros = JSON.parse(localStorage.getItem('libros'));
        }
        return libros;
    }

    static agregarLibro(libro){
        const libros = Datos.traerLibros();
        libros.push(libro);
        localStorage.setItem('libros', JSON.stringify(libros));
    }

    static removerLibro(isbn){
        const libros = Datos.traerLibros();
        console.log(isbn);
        libros.forEach((libro, index) => {
            if(libro.isbn === isbn){
                libros.splice(index, 1);
            }
        });
        localStorage.setItem('libros', JSON.stringify(libros));
    }



}

//Carga de la pagina
document.addEventListener('DOMContectLoaded',UI.mostrarLibros());


//Controlar el evento submit
document.querySelector('#libro-form').addEventListener('submit',(e) => {
    e.preventDefault();

    //Obtener valores de los campos
    const titulo = document.querySelector('#titulo').value;
    const autor = document.querySelector('#autor').value;
    const isbn = document.querySelector('#isbn').value;

    //Agrega , Muesta la lista y limpia los input
    if(titulo === '' || autor === '' || isbn === ''){
        UI.mostrarAlerta('Por favor ingrese todos los datos' , 'danger');
    }else{
        const libro = new Libro(titulo, autor, isbn);
        Datos.agregarLibro(libro);
        UI.mostrarAlerta(`Se agrego el libro: ${libro.titulo}`,'success');
        UI.agregarLibrosLista(libro);
        UI.limparLosCampos();
    }

});

document.querySelector('#libro-list').addEventListener('click', (e) =>{
    UI.eliminarLibros(e.target);
    Datos.removerLibro(e.target.parentElement.previousElementSibling.textContent);
    UI.mostrarAlerta(`Se elimino el libro`,'primary')
});