const express       = require('express')
const app           = express()
const port          = 4000
const cookieParser  = require ('cookie-parser')
const session       = require ('express-session')
const fileUpload    = require ('express-fileupload')

const c_beranda     = require ('./controller/c_beranda')
const c_auth        = require ('./controller/c_auth')
const c_toko        = require ('./controller/c_toko')
const c_olshop      = require ('./controller/c_olshop')
const c_profil      = require ('./controller/c_profil')
const cek_login     = c_auth.cek_login 

// settingan untuk data sessio  login
app.use( cookieParser('rahasia') )
app.use( session({
    secret: 'rahasia',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: (1000 * 60) * 30
        // batas session expired:
        // 1000 milidetik * 60 = 1 menit
        // 1 menit * 30 = 1/2 jam
    }
}))

app.use( express.urlencoded({extended:false}))
app.use( express.static('public'))
app.use( fileUpload() )

app.set('view engine', 'ejs') 
app.set('views', './view') 

app.get('/auth/register', c_auth.form_daftar)
app.post('/auth/proses-register', c_auth.proses_register)

app.get('/', c_beranda.beranda)
app.get('/auth/login', c_auth.hal_login)
app.post('/auth/proses-login' , c_auth.proses_login)
app.post('/auth/logout', cek_login, c_auth.proses_logout)

app.get('/toko', cek_login, c_toko.index)

app.get('/profil', cek_login, c_profil.index)
app.get('/profil/edit-foto', cek_login, c_profil.form_edit_foto)
app.post('/profil/proses-update-foto', cek_login, c_profil.proses_update_foto)
app.get('/profil/edit-nama', cek_login, c_profil.form_edit_nama)
app.post('/profil/proses-edit-nama', cek_login, c_profil.proses_update_nama)   
app.get('/profil/edit-email', cek_login, c_profil.form_edit_email)
app.post('/profil/proses-edit-email', cek_login, c_profil.proses_update_email)   
app.get('/profil/form-edit-password', cek_login, c_profil.form_edit_password )
app.post('/profil/proses-edit-password', cek_login, c_profil.proses_update_password)

app.get('/olshop', cek_login, c_olshop.hal_beranda)
app.get('/olshop/produk', cek_login, c_olshop.hal_index_produk)
app.get('/olshop/produk/tambah', cek_login, c_olshop.hal_form_tambah)
app.post('/olshop/produk/proses-insert', cek_login, c_olshop.proses_insert_produk)
app.get('/olshop/produk/detail/:id_produk', cek_login, c_olshop.detail_produk)
app.get('/olshop/produk/hapus/:id', cek_login, c_olshop.produk_hapus)
app.get('/olshop/produk/edit/:id_produk', cek_login, c_olshop.form_edit)
app.post('/olshop/produk/proses-edit/:id_produk', cek_login, c_olshop.proses_edit)
app.get('/olshop/keranjang/input/:id_produk', cek_login, c_olshop.keranjang_input)
app.get('/olshop/keranjang/list', cek_login, c_olshop.keranjang_list)
app.post('/olshop/keranjang/hapus/:id_keranjang', cek_login, c_olshop.keranjang_hapus)
app.post('/olshop/keranjang/bayar', cek_login, c_olshop.keranjang_bayar)


app.get('/olshop/orderan-masuk/list', cek_login, c_olshop.orderanMasuk_list)
app.post('/olshop/orderan-masuk/kirim-barang/:id_customer', cek_login, c_olshop.orderanMasuk_prosesKirimBarang)

app.listen(port, ()=>{
    console.log(`Aplikasi sudah siap, buka http://localhost:${port}`)
})