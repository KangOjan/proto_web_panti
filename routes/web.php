<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Portal Routes
Route::get('/', function () {
    return Inertia::render('Public/Beranda');
})->name('beranda');

Route::get('/profil', function () {
    return Inertia::render('Public/ProfilPanti');
})->name('profil');

Route::get('/donasi', function () {
    return Inertia::render('Public/DonasiPublik');
})->name('donasi');

Route::get('/keuangan-publik', function () {
    return Inertia::render('Public/PublicFinancialDashboard');
})->name('keuangan-publik');

Route::get('/campaign/{id}', function ($id) {
    return Inertia::render('Public/DetailCampaign', ['campaignId' => $id]);
})->name('campaign.detail');

Route::get('/berita', function () {
    return Inertia::render('Public/BeritaArtikel');
})->name('berita');

Route::get('/berita/{slug}', function ($slug) {
    return Inertia::render('Public/DetailBerita', ['articleSlug' => $slug]);
})->name('berita.detail');

Route::get('/faq', function () {
    return Inertia::render('Public/Faq');
})->name('faq');

// Auth Routes
Route::get('/login', function () {
    return Inertia::render('Auth/AuthPages', ['initialView' => 'login']);
})->name('login');

Route::get('/register', function () {
    return Inertia::render('Auth/AuthPages', ['initialView' => 'register']);
})->name('register');

// Admin & Pengelola Portal Routes (/admin and /pengelola prefix)
Route::get('/pengelola', function () {
    return Inertia::render('Admin/AdminDashboard');
})->name('pengelola');

Route::get('/pengelola/dashboard', function () {
    return Inertia::render('Admin/AdminDashboard');
})->name('pengelola.dashboard');

Route::get('/pengelola/verifikasi-donasi', function () {
    return Inertia::render('Admin/DonationVerification');
})->name('pengelola.verifikasi');

Route::get('/pengelola/donasi-offline', function () {
    return Inertia::render('Admin/OfflineDonation');
})->name('pengelola.offline');

Route::get('/pengelola/campaign', function () {
    return Inertia::render('Admin/CampaignManagement');
})->name('pengelola.campaign');

Route::get('/pengelola/konten', function () {
    return Inertia::render('Admin/ContentManagement');
})->name('pengelola.konten');

Route::get('/admin/dashboard', function () {
    return Inertia::render('Admin/AdminDashboard');
})->name('admin.dashboard');

Route::get('/admin/verifikasi-donasi', function () {
    return Inertia::render('Admin/DonationVerification');
})->name('admin.verifikasi');

Route::get('/admin/donasi-offline', function () {
    return Inertia::render('Admin/OfflineDonation');
})->name('admin.offline');

Route::get('/admin/campaign', function () {
    return Inertia::render('Admin/CampaignManagement');
})->name('admin.campaign');

Route::get('/admin/konten', function () {
    return Inertia::render('Admin/ContentManagement');
})->name('admin.konten');

// Auxiliary Internal Finance & Approval Routes
Route::get('/dashboard', function () {
    return Inertia::render('Finance/FinancialDashboard');
})->name('dashboard');

Route::get('/transaksi', function () {
    return Inertia::render('Finance/TransactionManagement');
})->name('transaksi');

Route::get('/laporan', function () {
    return Inertia::render('Finance/FinancialReportPSAK45');
})->name('laporan');

Route::get('/program', function () {
    return Inertia::render('Programs/ProgramManagement');
})->name('program');

Route::get('/approval', function () {
    return Inertia::render('UserApproval/UserApproval');
})->name('approval');

Route::get('/audit', function () {
    return Inertia::render('Audit/AuditTrailLog');
})->name('audit');
