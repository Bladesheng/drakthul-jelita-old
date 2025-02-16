<?php

namespace App\Http\Controllers;

use App\Models\Screenshot;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class ScreenshotController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $screenshots = Screenshot::all('id', 'path', 'wow_name', 'wow_class')
            ->groupBy('wow_class');

        return response()->json($screenshots);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $file = $request->file('file');

        $path = Storage::disk('s3')->putFile($file);

        $screenshot = new Screenshot;
        $screenshot->path = $path;
        $screenshot->mime_type = $file->getClientMimeType();
        $screenshot->size = $file->getSize();
        $screenshot->wow_name = $request->input('wowName');
        $screenshot->wow_class = $request->input('wowClass');
        $screenshot->save();

        return response()->json([
            'message' => 'screenshot uploaded successfully',
            'path' => $path,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $screenshot = Screenshot::findOrFail($id);
        $screenshot->wow_name = $request->input('wowName');
        $screenshot->wow_class = $request->input('wowClass');
        $screenshot->save();

        return response()->json([
            'message' => 'screenshot updated successfully',
            'screenshot' => $screenshot,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): Response
    {
        $screenshot = Screenshot::findOrFail($id);

        Storage::disk('s3')->delete($screenshot->path);

        $screenshot->delete();

        return response()->noContent();
    }
}
