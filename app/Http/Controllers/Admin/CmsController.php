<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CmsController extends Controller
{
    public function pages(Request $request)
    {
        return Inertia::render('admin/cms/pages', [
            'pages' => [],
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function createPage()
    {
        return Inertia::render('admin/cms/page-editor', [
            'mode' => 'create',
        ]);
    }

    public function editPage($id)
    {
        return Inertia::render('admin/cms/page-editor', [
            'mode' => 'edit',
            'pageId' => $id,
        ]);
    }

    public function navigation()
    {
        return Inertia::render('admin/cms/navigation', [
            'navigation' => [],
        ]);
    }

    public function footer()
    {
        return Inertia::render('admin/cms/footer', [
            'footer' => [],
        ]);
    }
}
