from rest_framework.authentication import SessionAuthentication

class CSRFExemptSessionAuthentication(SessionAuthentication):
    """Bypass CSRF for DRF endpoints """
    def enforce_csrf(self, request):
        return
