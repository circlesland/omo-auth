echo "" > nginx.conf
echo "server {"                                                                                   >> nginx.conf
echo "  server_name ${DOMAIN};"                                                                   >> nginx.conf

echo "   ssl_dhparam /etc/ssl/${DOMAIN}.dhparams.pem;"                                            >> nginx.conf

echo "   listen ${IPV4ADDRESS}:443 ssl http2 default_server;"                                     >> nginx.conf

echo "   ssl_protocols TLSv1 TLSv1.1 TLSv1.2;"                                                    >> nginx.conf
echo "   ssl_prefer_server_ciphers on;"                                                           >> nginx.conf
echo "   ssl_ciphers ECDH+AESGCM:ECDH+AES256:ECDH+AES128:DH+3DES:!ADH:!AECDH:!MD5;"               >> nginx.conf

echo "   ssl_session_cache shared:SSL:40m;"                                                       >> nginx.conf
echo "   ssl_session_timeout 8h;"                                                                 >> nginx.conf
echo "   ssl_session_tickets on;"                                                                 >> nginx.conf
echo "   ssl_stapling on;"                                                                        >> nginx.conf
echo "   ssl_stapling_verify on;"                                                                 >> nginx.conf

echo "   add_header Strict-Transport-Security ""max-age=31536000; includeSubDomains"" always;"    >> nginx.conf

echo "   root /usr/share/nginx/html;"                                                             >> nginx.conf

echo "   index index.html index.htm;"                                                             >> nginx.conf
echo "   error_page 401 403 404 /404.html;"                                                       >> nginx.conf

echo "   location /auth {"                                                                        >> nginx.conf
echo "      proxy_pass http://omo-auth:5000;"                                                     >> nginx.conf
echo "   }"                                                                                       >> nginx.conf
echo "}"                                                                                          >> nginx.conf
