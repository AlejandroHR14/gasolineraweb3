from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken


class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        return validated_token['user_id']

    def validate_token(self, token):
        try:
            validated_token = self.get_validated_token(token)
            return validated_token
        except InvalidToken as e:
            raise InvalidToken({'detail': str(e), 'code': 'token_not_valid'})

    def authenticate(self, request):
        http_host = request.META.get('HTTP_HOST')
        print(http_host)
        if http_host == 'localhost:8001' or http_host == 'localhost:8000':
            return None

        raw_token = self.get_raw_token(self.get_header(request))
        if raw_token is None:
            return None
        validated_token = self.validate_token(raw_token)
        return self.get_user(validated_token), validated_token
