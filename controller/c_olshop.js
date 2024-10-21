const m_master_produk_kategori = require('../model/m_master_produk_kategori')
const m_master_produk          = require('../model/m_master_produk')
const path                     = require('path')
const moment                   = require('moment')


module.exports = 
{

    hal_beranda: async (req,res) => {
        let data = {
            kategoriProduk: await m_master_produk_kategori.getSemua()
        }
        res.render('v_olshop/beranda', data)
    },

    hal_index_produk: async (req,res) => {
        let data = {
            kategoriProduk  : await m_master_produk_kategori.getSemua(),
            produkJual      : await m_master_produk.getSemua(),
            notifikasi      : req.query.notif
        }
        res.render('v_olshop/produk/index', data)
    },

    hal_form_tambah: async (req,res) => {
        let data = {
            kategoriProduk: await m_master_produk_kategori.getSemua()
        }
        res.render('v_olshop/produk/form-tambah', data)
    },

    proses_insert_produk: async function(req,res) {
        let foto1            = req.files.form_foto1
        let foto2            = req.files.form_foto2
        let foto3            = req.files.form_foto3

        // ganti nama file asli
        let email           = req.session.user[0].email.replaceAll('-', '-')
        let datetime        = moment().format('YYYYMMDD, HHmmss')

        let filename_foto1  = email + '_' + datetime + '_' + foto1.name
        let filename_foto2  = email + '_' + datetime + '_' + foto2.name
        let filename_foto3  = email + '_' + datetime + '_' + foto3.name
        
        let folder1_simpan  = path.join(__dirname, '../public/upload/produk-foto', filename_foto1)
        let folder2_simpan  = path.join(__dirname, '../public/upload/produk-foto', filename_foto2)
        let folder3_simpan  = path.join(__dirname, '../public/upload/produk-foto', filename_foto3)
        let pesan_upload    = ''

        foto1.mv(folder1_simpan, async function(err) {
            if (err) {
                pesan_upload += `<br>foto 1 gagal upload`
            } else {
                pesan_upload += `<br>foto 1 berhasil upload`
            }
        })
        foto2.mv(folder2_simpan, async function(err) {
            if (err) {
                pesan_upload += `<br>foto 2 gagal upload`
            } else {
                pesan_upload += `<br>foto 2 berhasil upload`
            }
        })
        foto3.mv(folder3_simpan, async function(err) {
            if (err) {
                pesan_upload += `<br>foto 3 gagal upload`
            } else {
                pesan_upload += `<br>foto 3 berhasil upload`
            }
        })

        try {
           let insert = await m_master_produk.insert( req, filename_foto1, filename_foto2, filename_foto3 )
            if (insert.affectedRows > 0) {
                res.redirect('/olshop/produk?notif=Berhasil input produk baru')
            }
        } catch (error) {
            throw error
        }
    },



}