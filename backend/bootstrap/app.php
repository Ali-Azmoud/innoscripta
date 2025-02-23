<?php

use App\Repositories\ArticleRepository;
use App\Repositories\AuthRepository;
use App\Repositories\Interfaces\ArticleRepositoryInterface;
use App\Repositories\Interfaces\AuthRepositoryInterface;
use App\Repositories\Interfaces\UserPreferenceRepositoryInterface;
use App\Repositories\UserPreferenceRepository;
use App\Services\ArticleService;
use App\Services\AuthService;
use App\Services\Interfaces\ArticleServiceInterface;
use App\Services\Interfaces\AuthServiceInterface;
use App\Services\Interfaces\UserPreferenceServiceInterface;
use App\Services\UserPreferenceService;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Http\Middleware\TrustProxies;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Illuminate\Foundation\Http\Middleware\ValidatePostSize;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withCommands([
        App\Console\Commands\FetchNewsArticles::class,
    ])
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append(TrustProxies::class);
        $middleware->append(HandleCors::class);
        $middleware->append(EnsureFrontendRequestsAreStateful::class);
        $middleware->append(EncryptCookies::class);
        $middleware->append(StartSession::class);
        $middleware->append(ShareErrorsFromSession::class);
        $middleware->append(VerifyCsrfToken::class);
//        $middleware->append(SubstituteBindings::class);
        $middleware->append(ConvertEmptyStringsToNull::class);
        $middleware->append(ValidatePostSize::class);

        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

    })
    ->withBindings([
        AuthRepositoryInterface::class => AuthRepository::class,
        AuthServiceInterface::class => AuthService::class,
        ArticleRepositoryInterface::class => ArticleRepository::class,
        ArticleServiceInterface::class => ArticleService::class,
        UserPreferenceRepositoryInterface::class => UserPreferenceRepository::class,
        UserPreferenceServiceInterface::class => UserPreferenceService::class,
    ])
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
