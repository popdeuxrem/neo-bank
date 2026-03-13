<?php

namespace App\Http\Controllers;

class GoogleController extends Controller
{
    public function redirect()
    {
        return redirect('/');
    }

    public function callback()
    {
        return redirect('/');
    }
}
