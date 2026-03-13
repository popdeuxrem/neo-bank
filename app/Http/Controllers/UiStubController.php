<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class UiStubController extends Controller
{
    public function index()
    {
        return Inertia::render('Landing');
    }

    public function dashboard()
    {
        return Inertia::render('Dashboard');
    }

    public function accounts()
    {
        return Inertia::render('Accounts');
    }

    public function transactions()
    {
        return Inertia::render('Transactions');
    }

    public function payments()
    {
        return Inertia::render('Payments');
    }

    public function ledger()
    {
        return Inertia::render('Ledger');
    }

    public function admin()
    {
        return Inertia::render('Admin');
    }

    public function login()
    {
        return Inertia::render('auth/Login');
    }

    public function register()
    {
        return Inertia::render('auth/Register');
    }

    public function forgotPassword()
    {
        return Inertia::render('auth/ForgotPassword');
    }
}
